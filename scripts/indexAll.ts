// scripts/indexAll.ts
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { fetchMgti } from "@/lib/connectors/mgti"
import { fetchSodica } from "@/lib/connectors/sodica"
import { fetchMySodimas } from "@/lib/connectors/mysodimas"
import { SupplierResult } from "@/lib/types"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function indexAll(query: string) {
  console.log(`⚡️ Indexation des pièces pour "${query}"`)

  const results: SupplierResult[] = await Promise.all([
    fetchMgti(query),
    fetchSodica(query),
    fetchMySodimas(query),
  ]).then(arrays => arrays.flat())

  console.log(`➡️ ${results.length} items trouvés`)

  for (const r of results) {
    const { error } = await supabase.from("parts").upsert({
      supplier: r.supplier,
      title: r.title,
      reference: r.reference,
      link: r.link,
      price: r.price || 0,
      brand: r.brand || "",
      name: r.title,
    }, {
      onConflict: ["reference", "supplier"],
    })
    if (error) console.error('❌ Erreur insertion Supabase :', error)
  }

  console.log('✅ Indexation terminée')
}

// Exemple d’utilisation
indexAll("motor")
