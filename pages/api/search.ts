import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { getRankedSuppliers } from "../../lib/suppliers";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const query = req.query.q;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Missing query parameter" });
  }

  const { data, error } = await supabase
    .from("parts")
    .select("*")
    .or(
      `reference.ilike.%${query}%,name.ilike.%${query}%,brand.ilike.%${query}%`
    );

  if (error) {
    console.error("Supabase error:", error);
    return res.status(500).json({ error: "Database error" });
  }

  const suppliers = getRankedSuppliers();

  const enrichedData = (data ?? []).map((part) => ({
    ...part,
    suppliers,
  }));

  return res.status(200).json(enrichedData);
}
