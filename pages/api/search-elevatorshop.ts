import type { NextApiRequest, NextApiResponse } from 'next'
import { searchElevatorshop } from '../../lib/connectors/elevatorshop'
import type { SupplierResult } from '../../lib/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    results: SupplierResult[]
    hasMore: boolean
  }>
) {
  const { query, page } = req.query
  const pageNumber = Number(page || 1)

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ results: [], hasMore: false })
  }

  try {
    const { results, hasMore } = await searchElevatorshop(query, pageNumber)

    return res.status(200).json({
      results,
      hasMore
    })
  } catch (error) {
    console.error('search-elevatorshop error:', error)
    return res.status(500).json({
      results: [],
      hasMore: false
    })
  }
}