import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const partId = req.query.partId as string

  if (!partId) {
    return res.status(400).json({ error: 'partId manquant' })
  }

  try {
    const { data, error } = await supabase
      .from('part_images')
      .select(`
        id,
        image_url,
        is_main
      `)
      .eq('part_id', partId)
      .order('is_main', { ascending: false })
      .order('created_at', { ascending: true })

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json(
      (data ?? []).map(img => ({
        id: img.id,
        url: img.image_url,
        isMain: img.is_main,
      }))
    )
  } catch {
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}
