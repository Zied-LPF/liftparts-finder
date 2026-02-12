import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' })
  }

  const { partId, imageId } = req.body

  if (!partId || !imageId) {
    return res.status(400).json({ error: 'partId ou imageId manquant' })
  }

  try {
    // 1️⃣ Reset toutes les images
    const { error: resetError } = await supabase
      .from('part_images')
      .update({ is_main: false })
      .eq('part_id', partId)

    if (resetError) {
      return res.status(500).json({ error: resetError.message })
    }

    // 2️⃣ Définir l’image principale
    const { error: setError } = await supabase
      .from('part_images')
      .update({ is_main: true })
      .eq('id', imageId)

    if (setError) {
      return res.status(500).json({ error: setError.message })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}
