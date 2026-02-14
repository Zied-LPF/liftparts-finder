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

function scoreMatch(text: string, query: string) {
  let score = 0
  const t = text.toLowerCase()
  const q = query.toLowerCase()

  if (t.includes(q)) score += 5
  if (t.replace(/\s/g, '').includes(q.replace(/\s/g, ''))) score += 3

  q.split(' ').forEach((word) => {
    if (t.includes(word)) score += 1
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
     🔹 SODIMAS — PROXY API JSON OFFICIELLE
     ========================================================= */
  try {
    const apiUrl =
      `https://my.sodimas.com/index.cfm?action=search.jsonList` +
      `&filtrePrincipal=searchstring` +
      `&filtrePrincipalValue=${encodeURIComponent(q)}` +
      `&searchstring=${encodeURIComponent(q)}` +
      `&start=0&length=50`

    const response = await fetch(apiUrl, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    })

    const data = await response.json()

    if (!data.data || data.data.length === 0) {
      throw new Error('Aucun produit')
    }

    let best = null
    let bestScore = 0

    for (const item of data.data) {
      const combinedText = `${item.ref} ${item.designation}`
      const score = scoreMatch(combinedText, q)

      if (score > bestScore) {
        best = item
        bestScore = score
      }
    }

    if (!best) {
      throw new Error('Pas de match pertinent')
    }

    const image = best.photo
      ? `https://my.sodimas.com/${best.photo}`
      : null

    const productLink = `https://my.sodimas.com/fr/produit?ref=${best.ref}`

    results.push({
      supplier: 'Sodimas',
      title: best.designation || best.ref,
      description: best.designation,
      reference: best.ref,
      image,
      fallbackImage:
        'https://my.sodimas.com/home/assets/img/com/logo.png',
      link: productLink,
    })
  } catch {
    results.push({
      supplier: 'Sodimas',
      title: 'Catalogue officiel Sodimas',
      description:
        'Recherche dans le catalogue Sodimas.',
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
     🔹 ELVACENTER (inchangé V2 stable)
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

    if (!bestMatch) throw new Error()

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
      description: 'Recherche dans le catalogue Elvacenter.',
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
