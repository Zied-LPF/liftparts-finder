import type { NextApiRequest, NextApiResponse } from 'next'

type SupplierResult = {
  supplier: string
  title: string | null
  description: string | null
  reference: string | null
  image: string | null
  link: string
  fallbackImage: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const q = (req.query.q as string)?.trim()
  if (!q) return res.status(400).json({ error: 'Query manquante' })

  const results: SupplierResult[] = []

  /* =====================
     🔹 SODIMAS (SAFE)
     ===================== */
  results.push({
    supplier: 'Sodimas',
    title: null,
    description: null,
    reference: null,
    image: null,
    fallbackImage: 'https://my.sodimas.com/home/assets/img/com/logo.png',
    link: `https://my.sodimas.com/fr/recherche?searchstring=${encodeURIComponent(q)}`,
  })

  /* =====================
     🔹 ELVACENTER (PRO SAFE MODE)
     ===================== */
  results.push({
    supplier: 'Elvacenter',
    title: null,
    description: null,
    reference: null,
    image: null,
    fallbackImage:
      'https://shop.elvacenter.com/wp-content/uploads/sites/5/2022/08/beelmerk-elvacenter.svg',
    link: `https://shop.elvacenter.com/#/dfclassic/query=${encodeURIComponent(q)}`,
  })

  return res.status(200).json(results)
}
