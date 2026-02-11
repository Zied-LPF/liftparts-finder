import type { NextApiRequest, NextApiResponse } from 'next'
import { SUPPLIERS } from '../../lib/suppliers'
import { supabase } from '../../lib/supabase'

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
     1️⃣ Fournisseur favori
     ========================= */
  const { data: settings } = await supabase
    .from('app_settings')
    .select('favorite_supplier')
    .limit(1)
    .single()

  const favoriteSupplier = settings?.favorite_supplier ?? null

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
    console.error(error)
    return res.status(500).json({ error })
  }

  if (!parts || parts.length === 0) {
    return res.status(200).json([])
  }

  /* =========================
     3️⃣ Résultats + scoring fournisseurs
     ========================= */
  const results = parts.map(part => {
    const scoredSuppliers = SUPPLIERS
      .filter(s => s.active)
      .map(supplier => {
        let score = supplier.priority ?? 0

        // ⭐ Boost fournisseur favori
        if (supplier.name === favoriteSupplier) {
          score += 1000
        }

        return {
          ...supplier,
          score,
          isFavorite: supplier.name === favoriteSupplier,
          link: `${supplier.baseUrl}${part.reference}`,
        }
      })
      .sort((a, b) => b.score - a.score)

    return {
      ...part,
      suppliers: scoredSuppliers,
    }
  })

  return res.status(200).json(results)
}
