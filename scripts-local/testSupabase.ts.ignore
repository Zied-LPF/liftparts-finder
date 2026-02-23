// Charge les variables d'environnement depuis .env.local
import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Les variables d'environnement SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY ne sont pas définies !")
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function testConnection() {
  const { data, error } = await supabase
    .from("parts_index")
    .select("*")
    .limit(1)

  if (error) {
    console.error("❌ Erreur de connexion à Supabase :", error)
  } else {
    console.log("✅ Connexion OK, voici un exemple de ligne :", data)
  }
}

testConnection()
