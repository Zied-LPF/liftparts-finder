import type { NextApiRequest, NextApiResponse } from 'next'
import { suppliers } from '../../lib/suppliers'

type SupplierResult = {
  supplier: string
  title: string
  reference: string
  image?: string
  link: string
  searched: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SupplierResult[]>
) {
  const q = (req.query.q as string || '').trim()

  if (!q) {
    return res.status(200).json([])
  }

  const results: SupplierResult[] = []

  for (const supplier of suppliers) {
    try {
      // ⚠️ ici on suppose que chaque supplier a déjà une logique interne
      // qui retourne title / reference / image / link
      const data = await supplier.search(q)

      if (!data) continue

      results.push({
        supplier: supplier.name,
        title: data.title,
        reference: data.reference,        // ✅ référence réelle fournisseur
        image: data.image || undefined,   // ✅ image réelle si dispo
        link: data.link,
        searched: q                        // ✅ ce que l’utilisateur a tapé
      })
    } catch (err) {
      console.error(`Erreur fournisseur ${supplier.name}`, err)
    }
  }

  res.status(200).json(results)
}
