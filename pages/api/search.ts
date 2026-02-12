import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = (req.query.q as string)?.trim()

  if (!query) {
    return res.status(400).json({ error: 'Query manquante' })
  }

  try {
    const { data, error } = await supabase
      .from('parts')
      .select(`
        id,
        name,
        reference,
        brand,
        category,
        notes
      `)
      .or(`name.ilike.%${query}%,reference.ilike.%${query}%`)
      .limit(50)

    if (error) {
      console.error('SUPABASE ERROR:', error)
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json(data ?? [])
  } catch (err) {
    console.error('SERVER ERROR:', err)
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}
