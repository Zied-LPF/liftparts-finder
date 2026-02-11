import type { NextApiRequest, NextApiResponse } from 'next'
import { suppliers } from '../../lib/suppliers'
import { supabase } from '../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const q = (req.query.q as string)?.trim()

  if (!q) {
    return res.status(200).json([])
  }

  // 🔹 Recherche des pièces
  const { data: parts, error } = await supabase
    .from('parts')
    .select('*')
    .or(`reference.ilike.%${q}%,name.ilike.%${q}%`)

  if (error) {
    console.error(error)
    return res.status(500).json([])
  }

  if (!parts || parts.length === 0) {
    return res.status(200).json([])
  }

  // 🔹 Générer un résultat par fournisseur actif
  const results = parts.flatMap((part) =>
    suppliers
      .filter((s) => s.active)
      .map((supplier) => ({
        id: `${part.id}_${supplier.name}`,
        name: part.name,
        reference: part.reference,
        brand: part.brand,
        supplier: {
          name: supplier.name,
          baseUrl: supplier.baseUrl,
        },
      }))
  )

  return res.status(200).json(results)
}
