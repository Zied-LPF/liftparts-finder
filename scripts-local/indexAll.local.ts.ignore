// scripts/indexAll.ts
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { scrapeMgti } from "../lib/connectors/mgti"
import { fetchSodica } from "../lib/connectors/sodica"
import { searchMySodimas } from "../lib/connectors/mysodimas"
import { scrapeDoofinder } from "../lib/connectors/doofinder"
import type { SupplierResult } from "../lib/types"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function upsertPart(r: SupplierResult) {
  await supabase.from("parts").upsert({
    supplier: r.supplier,
    title: r.title,
    reference: r.reference || r.title,
    link: r.link,
    price: r.price || 0,
    brand: r.brand || "",
    name: r.title,
  }, { onConflict: "reference,supplier" }) // correction Supabase v2
}

async function indexAll(query: string) {
  console.log(`⚡️ Indexation: ${query}`)

  const [mgtiParts, sodicaParts, mySodimasParts, doofinderParts] = await Promise.all([
    scrapeMgti(query),
    fetchSodica(query),
    searchMySodimas(query),
    scrapeDoofinder(query)
  ])

  // Cast final pour TypeScript afin d'éviter les erreurs de type
  const allResults = [
    ...mgtiParts,
    ...sodicaParts,
    ...mySodimasParts,
    ...doofinderParts
  ].filter(r => r.title && r.link) as SupplierResult[]

  console.log(`➡️ ${allResults.length} items trouvés`)

  for (const r of allResults) {
    await upsertPart(r)
  }

  console.log("✅ Indexation terminée")
}

const queries = ["motor","gear","pulley"]

async function main() {
  for (const q of queries) {
    await indexAll(q)
  }
}

main()