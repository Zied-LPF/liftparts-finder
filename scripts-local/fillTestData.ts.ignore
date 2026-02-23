// scripts/fillTestData.ts
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

// Lecture des variables d'environnement
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY non défini !')
  process.exit(1)
}

// Création du client Supabase avec la clé service_role
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function fillTestData() {
  console.log('⚡️ Insertion des données de test...')

  const testParts = [
    {
      reference: "MOTOR123",
      supplier: "MGTI",
      brand: "TestBrand",
      title: "Test Motor Part",
      name: "Test Motor Part",  // obligatoire, ne doit pas être null
      link: "https://example.com/motor123",
      price: 42.5,
    },
    {
      reference: "MOTOR124",
      supplier: "Sodica",
      brand: "TestBrand2",
      title: "Test Motor Part 2",
      name: "Test Motor Part 2",
      link: "https://example.com/motor124",
      price: 55.0,
    },
    {
      reference: "MOTOR125",
      supplier: "ElvaCenter",
      brand: "TestBrand3",
      title: "Test Motor Part 3",
      name: "Test Motor Part 3",
      link: "https://example.com/motor125",
      price: 63.0,
    },
  ]

  for (const part of testParts) {
    const { data, error } = await supabase
      .from('parts')
      .insert(part)
      .select()

    if (error) {
      console.error('❌ Erreur insertion test:', error)
    } else {
      console.log('✅ Test part insérée:', data)
    }
  }

  console.log('⚡️ Insertion test terminée')
}

// Lancement du script
fillTestData()
