import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json([]);
    }

    const q = req.query.q as string;

    if (!q) {
      return res.status(200).json([]);
    }

    const { data, error } = await supabase
      .from("parts")
      .select("*")
      .ilike("reference", `%${q}%`);

    if (error) {
      console.error("Supabase error:", error);
      return res.status(200).json([]);
    }

    return res.status(200).json(data || []);
  } catch (err) {
    console.error("Search API crash:", err);
    return res.status(200).json([]);
  }
}
