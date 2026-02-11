import type { NextApiRequest, NextApiResponse } from 'next'
import { suppliers } from '@/lib/suppliers'
import { supabase } from '@/lib/supabaseClient'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const { q } = req.query

  if (!q || typeof q !== 'string') {
    return res.status(200).json([])
  }

  /* =========================
     1️⃣ Récupérer fournisseur favori
     ========================= */
  const { data: settings, error: settingsError } = await supabase
    .from('app_settings')
    .select('favorite_supplier')
    .limit(1)
    .single()

  const favoriteSupplier = settings?.favorite_supplier || null

  if (settingsError) {
    console.error('Settings error:', settingsError)
  }

  /* =========================
     2️⃣ Recherche pièces
     ========================= */
  const { data: parts, error } = await supabase
    .from('parts')
    .select('*')
    .or(
      `reference.ilike.%${q}%,name.ilike.%${q}%,brand.ilike.%${q}%`
    )

  if (error) {
    console.error('Search error:', error)
    return res.status(500).json({ error })
  }

  if (!parts || parts.length === 0) {
    return res.status(200).json([])
  }

  /* =========================
     3️⃣ Construction résultats
     ========================= */
  const results = parts.map(part => {
    const scoredSuppliers = suppliers
      .filter(s => s.active)
      .map(supplier => {
        let score = supplier.priority || 0

        // ⭐ BOOST fournisseur favori
        if (supplier.name === favoriteSupplier) {
          score += 1000
        }

        return {
          ...supplier,
          score,
          link: `${supplier.baseUrl}${part.reference}`,
        }
      })
      .sort((a, b) => b.score - a.score)

    return {
      ...part,
      suppliers: scoredSuppliers,
    }
  })

  /* =========================
     4️⃣ Réponse API
     ========================= */
  return res.status(200).json(results)
}


