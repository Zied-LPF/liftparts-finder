import type { NextApiRequest, NextApiResponse } from 'next'
import { searchMySodimas } from '../../lib/connectors/mysodimas'
import type { SupplierResult } from '../../lib/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SupplierResult[] | { error: string }>
) {
  res.setHeader('Cache-Control', 'no-store')

  const query = req.query.q as string
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Missing query parameter q' })
  }

  console.log('API search start for query:', query)

  try {
    // 🔹 MySodimas uniquement
    const sodimasResults: SupplierResult[] =
      (await searchMySodimas(query).catch(err => {
        console.error('MySodimas error:', err)
        return []
      })) || []

    console.log('MySodimas count:', sodimasResults.length)

    const combined: SupplierResult[] = sodimasResults.map(r => ({
      ...r,
      title: r.title || r.designation || 'Produit MySodimas',
      image: r.image || '/logos/image-fallback.png'
    }))

    console.log('TOTAL COMBINED:', combined.length)

    return res.status(200).json(combined)
  } catch (err: any) {
    console.error('API search global error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}