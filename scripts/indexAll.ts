// scripts/indexAll.ts
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { scrapeMgti } from "../lib/connectors/mgti"
import { fetchSodica } from "../lib/connectors/sodica"
import { searchMySodimas } from "../lib/connectors/mysodimas"
import { fetchDoofinder } from "../lib/connectors/doofinder"
import { SupplierResult } from "../lib/types"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function upsertPart(r: SupplierResult) {
  await supabase.from("parts").upsert({
    supplier: r.supplier,
    title: r.title,
    reference: r.reference || r.title,
    link: r.link,
    price: r.price || 0,
    brand: r.brand || "",
    name: r.title,
  }, { onConflict: ["reference", "supplier"] })
}

async function indexAll(query: string) {
  console.log(`⚡️ Indexation: ${query}`)

  const [mgtiParts, sodicaParts, mySodimasParts, doofinderParts] = await Promise.all([
    scrapeMgti(query),
    fetchSodica(query),
    searchMySodimas(query),
    fetchDoofinder(query)
  ])

  const allResults: SupplierResult[] = [
    ...mgtiParts,
    ...sodicaParts,
    ...mySodimasParts,
    ...doofinderParts
  ]

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