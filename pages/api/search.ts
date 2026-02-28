// pages/api/search.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { searchMySodimas } from '../../lib/connectors/mysodimas'
import { searchElevatorshop } from '../../lib/connectors/elevatorshop'
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

  console.log('API search start for query (Sodimas + Elevatorshop):', query)

  try {
    // 🔹 Lancement en parallèle, Sodimas reste intact
    const [sodimasResults, elevatorshopResults] = await Promise.all([
      searchMySodimas(query).catch(err => {
        console.error('MySodimas error:', err)
        return []
      }),
      searchElevatorshop(query).catch(err => {
        console.error('Elevatorshop error:', err)
        return []
      })
    ])

    console.log('MySodimas count:', sodimasResults.length)
    console.log('Elevatorshop count:', elevatorshopResults.length)

    // 🔹 Fusion simple des résultats
    const combined: SupplierResult[] = [
      ...sodimasResults,
      ...elevatorshopResults
    ]

    console.log('TOTAL COMBINED:', combined.length)

    return res.status(200).json(combined)
  } catch (err: any) {
    console.error('API search global error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}