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

function scoreMatch(title: string, query: string) {
  let score = 0
  const normalizedTitle = title.toLowerCase()
  const normalizedQuery = query.toLowerCase()
  const compactTitle = normalizedTitle.replace(/\s/g, '')
  const compactQuery = normalizedQuery.replace(/\s/g, '')

  if (normalizedTitle.includes(normalizedQuery)) score += 5
  if (compactTitle.includes(compactQuery)) score += 3

  normalizedQuery.split(' ').forEach((word) => {
    if (normalizedTitle.includes(word)) score += 1
  })

  return score
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

  /* =========================================================
     🔹 SODIMAS V2 (SCORING + PARSING SI POSSIBLE)
     ========================================================= */
  try {
    const searchUrl = `https://my.sodimas.com/fr/recherche?searchstring=${encodeURIComponent(
      q
    )}`

    const searchHtml = await fetch(searchUrl).then((r) => r.text())
    const $search = cheerio.load(searchHtml)

    let bestMatch: { link: string; score: number } | null = null

    $search('a').each((_, el) => {
      const link = $search(el).attr('href')
      const text = $search(el).text().trim()

      if (!link || !text) return
      if (!link.includes('/fr/')) return

      const score = scoreMatch(text, q)

      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { link, score }
      }
    })

    if (!bestMatch || bestMatch.score === 0) {
      throw new Error('Pas de produit précis')
    }

    const productUrl = bestMatch.link.startsWith('http')
      ? bestMatch.link
      : `https://my.sodimas.com${bestMatch.link}`

    const productHtml = await fetch(productUrl).then((r) => r.text())
    const $product = cheerio.load(productHtml)

    const title =
      $product('h1').first().text().trim() || bestMatch.link

    const image =
      $product('img').first().attr('src') || null

    results.push({
      supplier: 'Sodimas',
      title,
      description: title,
      reference: null,
      image,
      fallbackImage:
        'https://my.sodimas.com/home/assets/img/com/logo.png',
      link: productUrl,
    })
  } catch {
    results.push({
      supplier: 'Sodimas',
      title: 'Catalogue officiel Sodimas',
      description:
        'Recherche dans le catalogue Sodimas. Accès direct aux fiches produits.',
      reference: null,
      image: null,
      fallbackImage:
        'https://my.sodimas.com/home/assets/img/com/logo.png',
      link: `https://my.sodimas.com/fr/recherche?searchstring=${encodeURIComponent(
        q
      )}`,
    })
  }

  /* =========================================================
     🔹 ELVACENTER V2 (STABLE)
     ========================================================= */
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

      const score = scoreMatch(title, q)

      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { link, score }
      }
    })

    if (!bestMatch || bestMatch.score === 0) {
      throw new Error('Pas trouvé')
    }

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
  } catch {
    results.push({
      supplier: 'Elvacenter',
      title: 'Catalogue Elvacenter',
      description:
        'Recherche dans le catalogue Elvacenter.',
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
