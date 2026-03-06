// pages/api/search-fast.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { searchMySodimas } from '../../lib/connectors/mysodimas'
import type { SupplierResult } from '../../lib/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ results: SupplierResult[]; hasMore: boolean }>
) {
  const { query, page } = req.query
  const pageNumber = parseInt(page as string) || 1

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ results: [], hasMore: false })
  }

  try {
    const { results, hasMore } = await searchMySodimas(query, pageNumber)

    res.status(200).json({ results, hasMore })
  } catch (error) {
    console.error('search-fast error:', error)
    res.status(500).json({ results: [], hasMore: false })
  }
}