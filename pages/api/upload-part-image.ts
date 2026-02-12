import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' })
  }

  const { partId, imageBase64, fileName } = req.body

  if (!partId || !imageBase64 || !fileName) {
    return res.status(400).json({ error: 'Paramètres manquants' })
  }

  try {
    const buffer = Buffer.from(imageBase64, 'base64')
    const filePath = `${partId}/${fileName}`

    // 1️⃣ Upload dans Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('part-images')
      .upload(filePath, buffer, {
        contentType: 'image/jpeg',
        upsert: true,
      })

    if (uploadError) {
      return res.status(500).json({ error: uploadError.message })
    }

    // 2️⃣ Récupérer l’URL publique
    const { data } = supabase.storage
      .from('part-images')
      .getPublicUrl(filePath)

    // 3️⃣ Enregistrer en DB
    const { error: dbError } = await supabase
      .from('part_images')
      .insert({
        part_id: partId,
        image_url: data.publicUrl,
      })

    if (dbError) {
      return res.status(500).json({ error: dbError.message })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}
