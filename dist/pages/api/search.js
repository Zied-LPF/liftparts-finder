"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const supabase_js_1 = require("@supabase/supabase-js");
const mgti_1 = require("../../lib/connectors/mgti");
const sodica_1 = require("../../lib/connectors/sodica");
const mysodimas_1 = require("../../lib/connectors/mysodimas");
const doofinder_1 = require("../../lib/connectors/doofinder");
const scoring_1 = require("../../lib/scoring");
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function handler(req, res) {
    const { q } = req.query;
    if (!q || typeof q !== "string") {
        return res.status(400).json({ error: "Query manquante" });
    }
    console.log("Recherche pour query:", q);
    try {
        // 🔹 Recherche locale Supabase
        const { data: localParts, error } = await supabase
            .from("parts")
            .select("*")
            .ilike("title", `%${q}%`);
        if (error) {
            console.error("Supabase error:", error);
        }
        console.log("Résultats locaux:", localParts);
        const supabaseResults = (localParts || []).map(p => ({
            supplier: p.supplier,
            title: p.title,
            reference: p.reference,
            link: p.link,
            price: p.price,
            brand: p.brand,
            source: "Supabase",
        }));
        // 🔹 Recherche connecteurs externes avec try/catch pour isoler les erreurs
        let mgtiParts = [];
        let sodicaParts = [];
        let mySodimasParts = [];
        let doofinderParts = [];
        try {
            mgtiParts = await (0, mgti_1.scrapeMgti)(q);
        }
        catch (e) {
            console.error("Erreur MGTI:", e);
        }
        try {
            sodicaParts = await (0, sodica_1.fetchSodica)(q);
        }
        catch (e) {
            console.error("Erreur Sodica:", e);
        }
        try {
            mySodimasParts = await (0, mysodimas_1.fetchMySodimas)(q);
        }
        catch (e) {
            console.error("Erreur MySodimas:", e);
        }
        try {
            doofinderParts = await (0, doofinder_1.scrapeDoofinder)(q);
        }
        catch (e) {
            console.error("Erreur Doofinder:", e);
        }
        const results = [
            ...supabaseResults,
            ...mgtiParts,
            ...sodicaParts,
            ...mySodimasParts,
            ...doofinderParts,
        ];
        // 🔹 Scoring
        results.forEach(r => {
            r.score = (0, scoring_1.scorePart)(r, q);
        });
        results.sort((a, b) => (b.score || 0) - (a.score || 0));
        res.json({ results });
    }
    catch (err) {
        console.error("Erreur serveur:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
}
