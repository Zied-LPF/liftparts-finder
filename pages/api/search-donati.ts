import type { NextApiRequest, NextApiResponse } from "next";
import { searchDonati } from "../../lib/connectors/donati";
import type { SupplierResult } from "../../lib/types";

type Data = {
  results: SupplierResult[];
  hasMore: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { query = "", page = "1" } = req.query;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ results: [], hasMore: false });
  }

  try {
    const { results, hasMore } = await searchDonati(
      query,
      parseInt(page as string, 10)
    );

    res.status(200).json({ results, hasMore });

  } catch (err) {
    console.error("API Donati error:", err);
    res.status(500).json({ results: [], hasMore: false });
  }
}