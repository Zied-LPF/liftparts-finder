import type { NextApiRequest, NextApiResponse } from 'next'
import { SUPPLIERS } from '../../lib/suppliers'
import { supabase } from '../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const q = String(req.query.q || '').trim()

  if (!q) {
    return res.status(200).json([])
  }

  const { data: parts, error } = await supabase
    .from('parts')
    .select('*')
    .or(`reference.ilike.%${q}%,name.ilike.%${q}%`)

  if (error || !parts) {
    console.error(error)
    return res.status(500).json([])
  }

  const enriched = parts.map((part) => {
    const supplier = SUPPLIERS.find(
      (s) => s.name.toLowerCase() === part.brand?.toLowerCase()
    )

    let score = supplier?.priority ?? 0
    if (supplier?.favorite) score += 1000

    return {
      ...part,
      supplier,
      score,
    }
  })

  enriched.sort((a, b) => b.score - a.score)

  res.status(200).json(enriched)
}
