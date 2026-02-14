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
  score: number
  exactMatch: boolean
}

function normalize(str: string) {
  return str.toLowerCase().replace(/[\s\-_/]/g, '')
}

function scoreMatch(text: string, query: string) {
  const t = normalize(text)
  const q = normalize(query)

  let score = 0
  let exactMatch = false

  if (t === q) {
    score += 50
    exactMatch = true
  }

  if (t.startsWith(q)) score += 20
  if (t.includes(q)) score += 10

  query.split(' ').forEach((word) => {
    if (t.includes(normalize(word))) score += 3
  })

  return { score, exactMatch }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const q = (req.query.q as string)?.trim()
  if (!q) return res.status(400).json({ error: 'Query manquante' })

  const results: SupplierResult[] = []

  /* ====================== ELVACENTER ====================== */

  try {
    const searchUrl = `https://shop.elvacenter.com/?s=${encodeURIComponent(
      q
    )}&post_type=product`

    const searchHtml = await fetch(searchUrl).then((r) => r.text())
    const $search = cheerio.load(searchHtml)

    let bestMatch: any = null

    $search('a.woocommerce-LoopProduct-link').each((_, el) => {
      const link = $search(el).attr('href')
      const title = $search(el).text().trim()
      if (!link || !title) return

      const { score, exactMatch } = scoreMatch(title, q)

      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { link, score, exactMatch, title }
      }
    })

    // ✅ SEUIL MINIMUM DE PERTINENCE
    if (!bestMatch || bestMatch.score < 15) {
      throw new Error('Score trop faible')
    }

    const productHtml = await fetch(bestMatch.link).then((r) => r.text())
    const $product = cheerio.load(productHtml)

    const title =
      $product('h1.product_title').text().trim() ||
      bestMatch.title ||
      null

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
      score: bestMatch.score,
      exactMatch: bestMatch.exactMatch,
    })
  } catch {}

  /* ====================== TRI ====================== */

  results.sort((a, b) => b.score - a.score)

  return res.status(200).json(results)
}
