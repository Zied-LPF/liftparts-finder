"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// scripts/indexAll.ts
require("dotenv/config");
const supabase_js_1 = require("@supabase/supabase-js");
const sodica_1 = require("@/lib/connectors/sodica");
const mysodimas_1 = require("@/lib/connectors/mysodimas");
const doofinder_1 = require("@/lib/connectors/doofinder");
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function upsertPart(r) {
    await supabase.from("parts").upsert({
        supplier: r.supplier,
        title: r.title,
        reference: r.reference || r.title,
        link: r.link,
        price: r.price || 0,
        brand: r.brand || "",
        name: r.title,
    }, { onConflict: ["reference", "supplier"] });
}
async function indexAll(query) {
    console.log(`⚡️ Indexation: ${query}`);
    const [mgtiParts, sodicaParts, mySodimasParts, doofinderParts] = await Promise.all([
        fetchMgti(query), (0, sodica_1.fetchSodica)(query), (0, mysodimas_1.fetchMySodimas)(query), (0, doofinder_1.fetchDoofinder)(query)
    ]);
    const allResults = [...mgtiParts, ...sodicaParts, ...mySodimasParts, ...doofinderParts];
    console.log(`➡️ ${allResults.length} items trouvés`);
    for (const r of allResults)
        await upsertPart(r);
    console.log("✅ Indexation terminée");
}
const queries = ["motor", "gear", "pulley"];
async function main() {
    for (const q of queries)
        await indexAll(q);
}
main();
