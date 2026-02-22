"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Charge les variables d'environnement depuis .env.local
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env.local" });
const supabase_js_1 = require("@supabase/supabase-js");
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("❌ Les variables d'environnement SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY ne sont pas définies !");
    process.exit(1);
}
const supabase = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_KEY);
async function testConnection() {
    const { data, error } = await supabase
        .from("parts_index")
        .select("*")
        .limit(1);
    if (error) {
        console.error("❌ Erreur de connexion à Supabase :", error);
    }
    else {
        console.log("✅ Connexion OK, voici un exemple de ligne :", data);
    }
}
testConnection();
