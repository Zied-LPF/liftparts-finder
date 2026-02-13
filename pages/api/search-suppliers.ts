import type { NextApiRequest, NextApiResponse } from 'next'
import { suppliers } from '../../lib/suppliers'

type SupplierResult = {
  supplier: string
  searchedValue: string
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
    // ✅ SODIMAS (pas de scraping produit pour l’instant)
    if (supplier.name === 'Sodimas') {
      results.push({
        supplier: 'Sodimas',
        searchedValue: q,
        link: `https://my.sodimas.com/fr/recherche?searchstring=${encodeURIComponent(q)}`
      })
    }

    // ✅ ELVACENTER
    if (supplier.name === 'Elvacenter') {
      const searchUrl = `https://shop.elvacenter.com/?s=${encodeURIComponent(
        q
      )}&post_type=product`

      try {
        const response = await fetch(searchUrl)
        const html = await response.text()

        const imageMatch = html.match(/<img[^>]+src="([^"]+)"/)
        const titleMatch = html.match(
          /class="woocommerce-loop-product__title">([^<]+)</
        )

        results.push({
          supplier: 'Elvacenter',
          searchedValue: q,
          title: titleMatch?.[1],
          image: imageMatch?.[1],
          link: searchUrl
        })
      } catch {
        results.push({
          supplier: 'Elvacenter',
          searchedValue: q,
          link: searchUrl
        })
      }
    }
  }

  return res.status(200).json(results)
}
