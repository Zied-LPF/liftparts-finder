import type { NextApiRequest, NextApiResponse } from 'next'

type SupplierResult = {
  supplier: string
  title: string | null
  description: string | null
  reference: string | null
  image: string | null
  fallbackImage: string
  link: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const q = (req.query.q as string)?.trim()
  if (!q) {
    return res.status(400).json({ error: 'Query manquante' })
  }

  const results: SupplierResult[] = []

  /* =====================
     🔹 SODIMAS — MODE CATALOGUE (V1)
     ===================== */
  results.push({
    supplier: 'Sodimas',
    title: 'Catalogue officiel Sodimas',
    description:
      'Recherche dans le catalogue Sodimas. Accès direct aux fiches produits.',
    reference: null, // ❗ volontairement NULL
    image: null,
    fallbackImage: 'https://my.sodimas.com/home/assets/img/com/logo.png',
    link: `https://my.sodimas.com/fr/recherche?searchstring=${encodeURIComponent(
      q
    )}`,
  })

  /* =====================
     🔹 ELVACENTER — MODE CATALOGUE (V1)
     ===================== */
  results.push({
    supplier: 'Elvacenter',
    title: 'Catalogue Elvacenter',
    description:
      'Recherche dans le catalogue Elvacenter. Accès aux produits disponibles.',
    reference: null,
    image: null,
    fallbackImage:
      'https://shop.elvacenter.com/wp-content/uploads/sites/5/2022/08/beelmerk-elvacenter.svg',
    link: `https://shop.elvacenter.com/#/dfclassic/query=${encodeURIComponent(
      q
    )}`,
  })

  return res.status(200).json(results)
}
