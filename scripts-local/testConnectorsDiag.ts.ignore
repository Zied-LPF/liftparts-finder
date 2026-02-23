// scripts/testConnectorsDiag.ts
import { scrapeMgti } from "../lib/connectors/mgti.ts"
import { fetchSodica } from "../lib/connectors/sodica.ts"
import { fetchMySodimas } from "../lib/connectors/mysodimas.ts"
import { scrapeDoofinder } from "../lib/connectors/doofinder.ts"

async function testConnectors(query: string) {
  console.log(`🔎 Test complet des connecteurs pour query: "${query}"\n`)

  const connectors = [
    { name: "MGTI", fn: scrapeMgti },
    { name: "Sodica", fn: fetchSodica },
    { name: "MySodimas", fn: fetchMySodimas },
    { name: "Doofinder", fn: scrapeDoofinder },
  ]

  for (const c of connectors) {
    console.log(`⏳ Test de ${c.name}...`)
    const start = Date.now()
    try {
      const results = await c.fn(query)
      const duration = Date.now() - start
      console.log(`✅ ${c.name} OK - ${results.length} résultats (temps: ${duration}ms)`)
      if (results.length > 0) {
        console.log("Exemple résultat:", results[0])
      }
    } catch (err: any) {
      const duration = Date.now() - start
      console.error(`❌ ${c.name} ERREUR (temps: ${duration}ms)`)
      if (err.cause) {
        console.error("Cause:", err.cause)
      }
      console.error("Message:", err.message || err)
    }
    console.log("--------------------------------------------------\n")
  }
}

// Exécution
const query = process.argv[2] || "mgti-1"
testConnectors(query)
  .then(() => console.log("🎯 Test complet terminé"))
  .catch(err => console.error(err))