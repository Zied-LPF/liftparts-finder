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
  if (req.method !== "PATCH") {
    return res.status(405).end();
  }

  const { partId, supplierId } = req.body;

  const { error } = await supabase
    .from("parts")
    .update({ favorite_supplier_id: supplierId })
    .eq("id", partId);

  if (error) {
    console.error(error);
    return res.status(500).json({ error: "Update failed" });
  }

  res.status(200).json({ success: true });
}
