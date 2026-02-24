import type { NextApiRequest, NextApiResponse } from 'next'
import { searchMySodimas } from '../../lib/connectors/mysodimas'
import { scrapeMgti, SupplierResult as MgtiResult } from '../../lib/connectors/mgti'
import type { SupplierResult } from '../../lib/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SupplierResult[] | { error: string }>
) {
  const query = req.query.q as string

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Missing query parameter q' })
  }

  console.log('API search start for query:', query)

  try {
    // 🔹 MySodimas results
    const sodimasResults = await searchMySodimas(query).catch(err => {
      console.error('MySodimas error:', err)
      return [] as SupplierResult[]
    })

    // 🔹 MGTI results
    const mgtiRaw: MgtiResult[] = await scrapeMgti(query).catch(err => {
      console.error('MGTI error:', err)
      return []
    })

    // 🔹 Formatage MGTI pour l'UI (title, designation, reference)
    const mgtiResults: SupplierResult[] = mgtiRaw.map(item => ({
      supplier: 'MGTI',
      reference: item.ref || '',
      title: item.label || item.ref || 'Produit MGTI',
      designation: item.label || item.ref || 'Produit MGTI',
      stock: item.stock || '',
      link: item.url || '',
      source: 'MGTI',
      brand: '', // on ne récupère pas de brand actuellement
      image: item.image || '/logos/image-fallback.png'
    }))

    // 🔹 Sodica standby
    const sodicaResults: SupplierResult[] = []

    // 🔹 Combine tous les résultats
    const combined: SupplierResult[] = [
      ...sodimasResults.map(r => ({
        ...r,
        title: r.title || r.designation || 'Produit MySodimas',
        image: r.image || '/logos/image-fallback.png'
      })),
      ...mgtiResults,
      ...sodicaResults
    ]

    return res.status(200).json(combined)
  } catch (err: any) {
    console.error('API search global error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}