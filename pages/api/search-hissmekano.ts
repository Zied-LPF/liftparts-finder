// pages/api/search-hissmekano.ts
import type { NextApiRequest, NextApiResponse } from "next"
import { searchHissmekano } from "../../lib/connectors/hissmekano"
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
    const { results, hasMore } = await searchHissmekano(
      query,
      parseInt(page as string, 10)
    )
    res.status(200).json({ results, hasMore })
  } catch (err) {
    console.error("API Hissmekano error:", err)
    res.status(500).json({ results: [], hasMore: false })
  }
}
