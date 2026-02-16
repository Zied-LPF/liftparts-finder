// scripts/indexAll.ts
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { fetchMgti } from "@/lib/connectors/mgti"
import { fetchSodica } from "@/lib/connectors/sodica"
import { fetchMySodimas } from "@/lib/connectors/mysodimas"
import { fetchDoofinder } from "@/lib/connectors/doofinder"
import { SupplierResult } from "@/lib/types"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Fonction pour upsert un résultat dans Supabase
async function upsertPart(r: SupplierResult) {
  const { error } = await supabase.from("parts").upsert({
    supplier: r.supplier,
    title: r.title,
    reference: r.reference || r.title,
    link: r.link,
    price: r.price || 0,
    brand: r.brand || "",
    name: r.title,
  }, {
    onConflict: ["reference", "supplier"],
  })

  if (error) console.error('❌ Erreur insertion Supabase :', error)
}

// Fonction principale d'indexation
async function indexAll(query: string) {
  console.log(`⚡️ Indexation des pièces pour "${query}"`)

  // 1️⃣ Récupérer tous les connecteurs + Doofinder
  const [mgtiParts, sodicaParts, mySodimasParts, doofinderParts] = await Promise.all([
    fetchMgti(query),
    fetchSodica(query),
    fetchMySodimas(query),
    fetchDoofinder(query),
  ])

  const allResults: SupplierResult[] = [
    ...mgtiParts,
    ...sodicaParts,
    ...mySodimasParts,
    ...doofinderParts,
  ]

  console.log(`➡️ ${allResults.length} items trouvés au total`)

  // 2️⃣ Upsert dans Supabase
  for (const r of allResults) {
    await upsertPart(r)
  }

  console.log('✅ Indexation terminée')
}

// 3️⃣ Exemple d’utilisation
const queries = ["motor", "gear", "pulley"] // liste de mots-clés à indexer

async function main() {
  for (const q of queries) {
    await indexAll(q)
  }
}

main()
