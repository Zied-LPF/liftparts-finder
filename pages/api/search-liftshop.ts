// pages/api/search-liftshop.ts
import type { NextApiRequest, NextApiResponse } from "next"
import { searchLiftshop } from "../../lib/connectors/liftshop"
import type { SupplierResult } from "../../lib/types"

type Data = {
  results: SupplierResult[]
  hasMore: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { query = "", page = "1" } = req.query

  if (!query || typeof query !== "string") {
    return res.status(400).json({ results: [], hasMore: false })
  }

  try {
    const { results, hasMore } = await searchLiftshop(
      query,
      parseInt(page as string, 10)
    )
    res.status(200).json({ results, hasMore })
  } catch (err) {
    console.error("API LiftShop error:", err)
    res.status(500).json({ results: [], hasMore: false })
  }
}
