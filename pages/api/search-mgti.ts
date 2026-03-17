// pages/api/search-mgti.ts
import type { NextApiRequest, NextApiResponse } from "next"
import { searchMGTI } from "../../lib/connectors/mgti"  // 🔹 Corrigé : searchMGTI

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query = "", page = "1" } = req.query
  const result = await searchMGTI(query as string, parseInt(page as string, 10))
  res.status(200).json(result)
}