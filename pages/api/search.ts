// pages/api/search.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { searchMySodimas } from '../../lib/connectors/mysodimas'
import { scrapeMgti } from '../../lib/connectors/mgti'
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
    const mgtiResults = await scrapeMgti(query).catch(err => {
      console.error('MGTI error:', err)
      return [] as SupplierResult[]
    })

    // 🔹 Formatage MGTI pour correspondre à l'UI
    const mgtiFormatted = mgtiResults.map((item: any) => ({
      supplier: 'MGTI',
      reference: item.ref || '',
      designation: item.label || '',
      stock: item.stock || '',
      link: item.url || '',
      source: 'MGTI',
      brand: item.brand || '',
      image: item.image || '' // 🔹 conserver l'image
    }))

    // Sodica toujours en standby
    const sodicaResults: SupplierResult[] = []

    // 🔹 Combine tous les résultats
    const combined: SupplierResult[] = [
      ...sodimasResults,
      ...mgtiFormatted,
      ...sodicaResults
    ].map(item => ({
      ...item,
      // 🔹 Fallback image si vide pour éviter carte cassée
      image: item.image || '/logos/image-fallback.png'
    }))

    return res.status(200).json(combined)
  } catch (err: any) {
    console.error('API search global error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}