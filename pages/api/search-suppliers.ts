import type { NextApiRequest, NextApiResponse } from 'next'
import { suppliers } from '../../lib/suppliers'

type SupplierResult = {
  supplier: string
  title: string
  image?: string
  link: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = (req.query.q as string)?.trim()

  if (!query) {
    return res.status(400).json({ error: 'Query manquante' })
  }

  const results: SupplierResult[] = []

  const activeSuppliers = suppliers.filter(
    s => s.name === 'Sodimas' || s.name === 'Elvacenter'
  )

  for (const supplier of activeSuppliers) {
    try {
      const searchUrl = `${supplier.baseUrl}${encodeURIComponent(query)}`

      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'LiftPartsFinder/2.0',
          'Accept': 'text/html',
        },
      })

      if (!response.ok) {
        console.warn(`HTTP ${response.status} chez ${supplier.name}`)
        continue
      }

      const html = await response.text()

      let title = query
      let image: string | undefined
      let link = searchUrl

      /* =========================
         🟢 SODIMAS — PARSING AMÉLIORÉ
         ========================= */
      if (supplier.name === 'Sodimas') {
        // 1️⃣ Lien vers la première fiche produit
        const linkMatch = html.match(
          /href="(\/fr\/produit\/[^"]+)"/i
        )
        if (linkMatch) {
          link = `https://my.sodimas.com${linkMatch[1]}`
        }

        // 2️⃣ Image produit (on évite le logo)
        const imgMatch = html.match(
          /<img[^>]+src="([^"]+)"[^>]*class="[^"]*product[^"]*"/i
        )
        if (imgMatch && !imgMatch[1].includes('logo')) {
          image = imgMatch[1].startsWith('http')
            ? imgMatch[1]
            : `https://my.sodimas.com${imgMatch[1]}`
        }

        // 3️⃣ Titre produit
        const titleMatch = html.match(
          /<h3[^>]*>(.*?)<\/h3>/i
        )
        if (titleMatch) {
          title = titleMatch[1]
            .replace(/<[^>]+>/g, '')
            .trim()
        }
      }

      /* =========================
         🟢 ELVACENTER — PARSING AMÉLIORÉ
         ========================= */
      if (supplier.name === 'Elvacenter') {
        // 1️⃣ Lien produit (SPA)
        const linkMatch = html.match(
          /href="(#\/product\/[^"]+)"/i
        )
        if (linkMatch) {
          link = `https://shop.elvacenter.com/${linkMatch[1]}`
        }

        // 2️⃣ Image produit (data-src ou src)
        const imgMatch = html.match(
          /<img[^>]+(data-src|src)="([^"]+)"/i
        )
        if (imgMatch) {
          image = imgMatch[2].startsWith('http')
            ? imgMatch[2]
            : `https://shop.elvacenter.com${imgMatch[2]}`
        }

        // 3️⃣ Titre produit
        const titleMatch = html.match(
          /<h2[^>]*>(.*?)<\/h2>/i
        )
        if (titleMatch) {
          title = titleMatch[1]
            .replace(/<[^>]+>/g, '')
            .trim()
        }
      }

      results.push({
        supplier: supplier.name,
        title,
        image,
        link,
      })
    } catch (err) {
      console.error(`Erreur fournisseur ${supplier.name}`, err)
    }
  }

  return res.status(200).json(results)
}
