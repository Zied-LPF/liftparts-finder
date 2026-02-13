import type { NextApiRequest, NextApiResponse } from 'next'
import { suppliers } from '../../lib/suppliers'

type SupplierResult = {
  supplier: string
  searchQuery: string
  productRef?: string
  title?: string
  description?: string
  image?: string
  link: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SupplierResult[]>
) {
  const q = (req.query.q as string)?.trim()

  if (!q) {
    return res.status(200).json([])
  }

  const results: SupplierResult[] = []

  for (const supplier of suppliers) {
    // 🔹 SODIMAS
    if (supplier.name === 'Sodimas') {
      results.push({
        supplier: 'Sodimas',
        searchQuery: q,
        link: `https://my.sodimas.com/fr/recherche?searchstring=${encodeURIComponent(q)}`
        // Sodimas = pas de parsing produit fiable pour l’instant
      })
    }

    // 🔹 ELVACENTER
    if (supplier.name === 'Elvacenter') {
      try {
        const searchUrl = `https://shop.elvacenter.com/?s=${encodeURIComponent(
          q
        )}&post_type=product`

        const response = await fetch(searchUrl)
        const html = await response.text()

        // tentative simple d’extraction (safe)
        const imageMatch = html.match(/<img[^>]+src="([^"]+)"/)
        const titleMatch = html.match(/class="woocommerce-loop-product__title">([^<]+)/)

        results.push({
          supplier: 'Elvacenter',
          searchQuery: q,
          productRef: q, // temporaire → amélioré au parsing V2
          title: titleMatch?.[1],
          image: imageMatch?.[1],
          link: searchUrl
        })
      } catch (e) {
        results.push({
          supplier: 'Elvacenter',
          searchQuery: q,
          link: `https://shop.elvacenter.com/?s=${encodeURIComponent(q)}`
        })
      }
    }
  }

  return res.status(200).json(results)
}
