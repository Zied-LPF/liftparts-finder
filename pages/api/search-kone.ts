// pages/api/search-kone.ts
import type { NextApiRequest, NextApiResponse } from "next"
import { searchKone } from "../../lib/connectors/kone"
import type { SupplierResult } from "../../lib/types"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ results: SupplierResult[]; hasMore: boolean } | { error: string }>
) {
  const { query, page = "1" } = req.query

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Missing query" })
  }

  try {
    const data = await searchKone(query, Number(page))
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: "KONE search failed" })
  }
}