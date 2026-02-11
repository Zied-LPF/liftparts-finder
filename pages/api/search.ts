import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'
import { SUPPLIERS } from '../../lib/suppliers'
import { computeScore } from '../../lib/scoring'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const q = String(req.query.q || '').trim()

  if (!q) {
    return res.status(200).json([])
  }

  const { data, error } = await supabase
    .from('parts')
    .select('*')

  if (error) {
    console.error(error)
    return res.status(500).json({ error: 'Database error' })
  }

  const results = data
    .map((part) => {
      const supplier =
        SUPPLIERS.find(
          (s) =>
            s.name.toLowerCase() ===
            String(part.supplier || '').toLowerCase()
        ) || null

      const score = computeScore(
        {
          ...part,
          supplier,
        },
        q
      )

      return {
        ...part,
        supplier,
        score,
      }
    })
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)

  res.status(200).json(results)
}
