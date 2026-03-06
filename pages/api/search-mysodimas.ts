// pages/api/search-mysodimas.ts
import type { NextApiRequest, NextApiResponse } from "next"
import { searchMySodimas } from "../../lib/connectors/mysodimas"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query.query as string
  const page = parseInt(req.query.page as string) || 1
  const perPage = 50 // 🔹 Première page récupère 50 produits (ou plus si besoin)

  if (!query) {
    return res.status(400).json({ results: [], hasMore: false })
  }

  try {
    const { results, hasMore } = await searchMySodimas(query, page, perPage)
    res.status(200).json({ results, hasMore })
  } catch (err) {
    console.error(err)
    res.status(500).json({ results: [], hasMore: false })
  }
}