// pages/api/search.ts
import type { NextApiRequest, NextApiResponse } from "next"
import { createClient } from "@supabase/supabase-js"
import { fetchMgti } from "@/lib/connectors/mgti"
import { fetchSodica } from "@/lib/connectors/sodica"
import { fetchMySodimas } from "@/lib/connectors/mysodimas"
import { fetchDoofinder } from "@/lib/connectors/doofinder"
import { scorePart } from "@/lib/scoring"
import { SupplierResult } from "@/lib/types"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q } = req.query
  if (!q || typeof q !== "string") return res.status(400).json({ error: "Query manquante" })

  try {
    const { data: localParts } = await supabase.from("parts").select("*").ilike("title", `%${q}%`)
    const supabaseResults: SupplierResult[] = (localParts || []).map(p => ({
      supplier: p.supplier,
      title: p.title,
      reference: p.reference,
      link: p.link,
      price: p.price,
      brand: p.brand,
      source: "Supabase",
    }))

    const [mgtiParts, sodicaParts, mySodimasParts, doofinderParts] = await Promise.all([
      fetchMgti(q), fetchSodica(q), fetchMySodimas(q), fetchDoofinder(q)
    ])

    const results: SupplierResult[] = [
      ...supabaseResults,
      ...mgtiParts, ...sodicaParts, ...mySodimasParts, ...doofinderParts
    ]

    results.forEach(r => r.score = scorePart(r, q))
    results.sort((a,b) => (b.score || 0) - (a.score || 0))

    res.json({ results })
  } catch(err) {
    console.error(err)
    res.status(500).json({ error: "Erreur serveur" })
  }
}
