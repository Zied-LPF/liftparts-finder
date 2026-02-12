import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string

  if (!id) {
    return res.status(400).json({ error: 'ID manquant' })
  }

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
    .eq('id', id)
    .single()

  if (error) {
    console.error(error)
    return res.status(500).json({ error: 'Erreur Supabase' })
  }

  return res.status(200).json(data)
}
