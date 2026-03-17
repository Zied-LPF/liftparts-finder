// pages/api/search-sodica.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { searchSodica } from "../../lib/connectors/sodica";
import type { SupplierResult } from "../../lib/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    { results: SupplierResult[]; hasMore: boolean } | { error: string }
  >
) {
  const query = req.query.query as string;
  const page = parseInt(req.query.page as string) || 1;

  if (!query) {
    res.status(400).json({ error: "Missing query parameter" });
    return;
  }

  try {
    // On appelle le connecteur Sodica mis à jour
    const { results, hasMore } = await searchSodica(query, page);
    res.status(200).json({ results, hasMore });
  } catch (err) {
    console.error("Erreur API Sodica:", err);
    res.status(500).json({ error: "Failed to fetch results from Sodica" });
  }
}