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
     🔹 SODIMAS (MODE CATALOGUE STABLE)
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
     🔹 ELVACENTER V2.1 (SCORING PERTINENCE)
     ===================== */
  try {
    const searchUrl = `https://shop.elvacenter.com/?s=${encodeURIComponent(
      q
    )}&post_type=product`

    const searchHtml = await fetch(searchUrl).then((r) => r.text())
    const $search = cheerio.load(searchHtml)

    let bestMatch: { link: string; score: number } | null = null

    $search('a.woocommerce-LoopProduct-link').each((_, el) => {
      const link = $search(el).attr('href')
      const title = $search(el).text().trim()

      if (!link || !title) return

      let score = 0
      const normalizedTitle = title.toLowerCase()
      const normalizedQuery = q.toLowerCase()
      const compactTitle = normalizedTitle.replace(/\s/g, '')

      // Score fort si correspondance exacte
      if (normalizedTitle.includes(normalizedQuery)) score += 5

      // Score si correspondance compacte (ex: KM 846291 G02)
      if (compactTitle.includes(normalizedQuery.replace(/\s/g, '')))
        score += 3

      // Score partiel
      const words = normalizedQuery.split(' ')
      words.forEach((word) => {
        if (normalizedTitle.includes(word)) score += 1
      })

      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { link, score }
      }
    })

    if (!bestMatch || bestMatch.score === 0) {
      throw new Error('Aucun produit pertinent trouvé')
    }

    // 2️⃣ Chargement fiche produit
    const productHtml = await fetch(bestMatch.link).then((r) => r.text())
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
      link: bestMatch.link,
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
