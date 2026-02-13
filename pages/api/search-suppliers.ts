import type { NextApiRequest, NextApiResponse } from 'next'
import * as cheerio from 'cheerio'

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
     🔹 SODIMAS — catalogue (inchangé)
     ===================== */
  results.push({
    supplier: 'Sodimas',
    title: 'Catalogue officiel Sodimas',
    description:
      'Recherche dans le catalogue Sodimas. Accès direct aux fiches produits.',
    reference: null,
    image: null,
    fallbackImage: 'https://my.sodimas.com/home/assets/img/com/logo.png',
    link: `https://my.sodimas.com/fr/recherche?searchstring=${encodeURIComponent(
      q
    )}`,
  })

  /* =====================
     🔹 ELVACENTER — V2 PARSING HTML
     ===================== */
  try {
    // 1️⃣ Recherche HTML WordPress (PAS Angular)
    const searchUrl = `https://shop.elvacenter.com/?s=${encodeURIComponent(
      q
    )}&post_type=product`
    const searchHtml = await fetch(searchUrl).then((r) => r.text())
    const $search = cheerio.load(searchHtml)

    const productLink =
      $search('a.woocommerce-LoopProduct-link').first().attr('href') || null

    if (!productLink) {
      throw new Error('Aucun produit trouvé')
    }

    // 2️⃣ Page produit
    const productHtml = await fetch(productLink).then((r) => r.text())
    const $product = cheerio.load(productHtml)

    const title = $product('h1.product_title').text().trim() || null
    const reference =
      $product('.sku').first().text().trim() || null
    const image =
      $product('.wp-post-image').attr('src') ||
      $product('meta[property="og:image"]').attr('content') ||
      null

    results.push({
      supplier: 'Elvacenter',
      title,
      description: title,
      reference,
      image,
      fallbackImage:
        'https://shop.elvacenter.com/wp-content/uploads/sites/5/2022/08/beelmerk-elvacenter.svg',
      link: productLink,
    })
  } catch (e) {
    results.push({
      supplier: 'Elvacenter',
      title: 'Catalogue Elvacenter',
      description:
        'Recherche dans le catalogue Elvacenter. Aucun produit précis identifié.',
      reference: null,
      image: null,
      fallbackImage:
        'https://shop.elvacenter.com/wp-content/uploads/sites/5/2022/08/beelmerk-elvacenter.svg',
      link: `https://shop.elvacenter.com/?s=${encodeURIComponent(
        q
      )}&post_type=product`,
    })
  }

  return res.status(200).json(results)
}
