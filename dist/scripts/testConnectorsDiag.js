"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// scripts/testConnectorsDiag.ts
const mgti_1 = require("../lib/connectors/mgti");
const sodica_1 = require("../lib/connectors/sodica");
const mysodimas_1 = require("../lib/connectors/mysodimas");
const doofinder_1 = require("../lib/connectors/doofinder");
async function testConnectors(query) {
    console.log(`🔎 Test complet des connecteurs pour query: "${query}"\n`);
    const connectors = [
        { name: "MGTI", fn: mgti_1.scrapeMgti },
        { name: "Sodica", fn: sodica_1.fetchSodica },
        { name: "MySodimas", fn: mysodimas_1.fetchMySodimas },
        { name: "Doofinder", fn: doofinder_1.scrapeDoofinder },
    ];
    for (const c of connectors) {
        console.log(`⏳ Test de ${c.name}...`);
        const start = Date.now();
        try {
            const results = await c.fn(query);
            const duration = Date.now() - start;
            console.log(`✅ ${c.name} OK - ${results.length} résultats (temps: ${duration}ms)`);
            if (results.length > 0) {
                console.log("Exemple résultat:", results[0]);
            }
        }
        catch (err) {
            const duration = Date.now() - start;
            console.error(`❌ ${c.name} ERREUR (temps: ${duration}ms)`);
            if (err.cause) {
                console.error("Cause:", err.cause);
            }
            console.error("Message:", err.message || err);
        }
        console.log("--------------------------------------------------\n");
    }
}
// Exécution
const query = process.argv[2] || "mgti-1";
testConnectors(query)
    .then(() => console.log("🎯 Test complet terminé"))
    .catch(err => console.error(err));
