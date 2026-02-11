import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

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

  const query = req.query.q as string;

  if (!query) {
    return res.status(400).json({ error: "Missing query parameter" });
  }

  const { data, error } = await supabase
    .from("parts")
    .select("*")
    .ilike("reference", `%${query}%`);

  if (error) {
    console.error("Supabase error:", error);
    return res.status(500).json({ error: "Database error" });
  }

  return res.status(200).json(data ?? []);
}
