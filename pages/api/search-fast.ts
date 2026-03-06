import type { NextApiRequest, NextApiResponse } from 'next'
import { searchMySodimas } from '../../lib/connectors/mysodimas'
import type { SupplierResult } from '../../lib/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SupplierResult[]>
) {
  const { query } = req.query

  if (!query || typeof query !== 'string') {
    return res.status(400).json([])
  }

  try {
    const sodimas = await searchMySodimas(query)

    res.status(200).json(sodimas || [])
  } catch (error) {
    console.error('search-fast error:', error)
    res.status(500).json([])
  }
}