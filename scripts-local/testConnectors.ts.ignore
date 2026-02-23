// scripts/testConnectors.ts
import { scrapeMgti } from "../lib/connectors/mgti"
import { fetchSodica } from "../lib/connectors/sodica"
import { fetchMySodimas } from "../lib/connectors/mysodimas"
import { scrapeDoofinder } from "../lib/connectors/doofinder"

async function testConnectors(query: string) {
  console.log(`🔎 Test des connecteurs pour query: "${query}"\n`)

  const connectors = [
    { name: "MGTI", fn: scrapeMgti },
    { name: "Sodica", fn: fetchSodica },
    { name: "MySodimas", fn: fetchMySodimas },
    { name: "Doofinder", fn: scrapeDoofinder },
  ]

  for (const c of connectors) {
    try {
      const results = await c.fn(query)
      console.log(`✅ ${c.name}: ${results.length} résultats`)
      if (results.length > 0) {
        console.log("Exemple:", results[0])
      }
    } catch (err) {
      console.error(`❌ ${c.name} a échoué:`, err.message || err)
    }
    console.log("--------------------------------------------------")
  }
}

// Exécution
const query = process.argv[2] || "mgti-1"
testConnectors(query)
  .then(() => console.log("\n🎯 Test terminé"))
  .catch(err => console.error(err))