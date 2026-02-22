"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// scripts/testConnectors.ts
const mgti_1 = require("../lib/connectors/mgti");
const sodica_1 = require("../lib/connectors/sodica");
const mysodimas_1 = require("../lib/connectors/mysodimas");
const doofinder_1 = require("../lib/connectors/doofinder");
async function testConnectors(query) {
    console.log(`🔎 Test des connecteurs pour query: "${query}"\n`);
    const connectors = [
        { name: "MGTI", fn: mgti_1.scrapeMgti },
        { name: "Sodica", fn: sodica_1.fetchSodica },
        { name: "MySodimas", fn: mysodimas_1.fetchMySodimas },
        { name: "Doofinder", fn: doofinder_1.scrapeDoofinder },
    ];
    for (const c of connectors) {
        try {
            const results = await c.fn(query);
            console.log(`✅ ${c.name}: ${results.length} résultats`);
            if (results.length > 0) {
                console.log("Exemple:", results[0]);
            }
        }
        catch (err) {
            console.error(`❌ ${c.name} a échoué:`, err.message || err);
        }
        console.log("--------------------------------------------------");
    }
}
// Exécution
const query = process.argv[2] || "mgti-1";
testConnectors(query)
    .then(() => console.log("\n🎯 Test terminé"))
    .catch(err => console.error(err));
