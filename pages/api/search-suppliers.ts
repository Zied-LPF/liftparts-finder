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
  return str
    .toLowerCase()
    .replace(/[\s\-_/]/g, '')
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
    if (t.includes(normalize(word))) score += 2
  })

  return { score, exactMatch }
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
     🔹 SODIMAS — V2 INTELLIGENT SCORING
     ========================================================= */

  try {
    const initResponse = await fetch(
      'https://my.sodimas.com/fr/recherche',
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
        },
      }
    )

    const rawCookies = initResponse.headers.get('set-cookie')
    const cookieHeader = rawCookies
      ? rawCookies.split(',').map((c) => c.split(';')[0]).join('; ')
      : ''

    const apiUrl =
      `https://my.sodimas.com/index.cfm?action=search.jsonList` +
      `&filtrePrincipal=searchstring` +
      `&filtrePrincipalValue=${encodeURIComponent(q)}` +
      `&searchstring=${encodeURIComponent(q)}` +
      `&start=0&length=50`

    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': 'https://my.sodimas.com/fr/recherche',
        'Origin': 'https://my.sodimas.com',
        'Cookie': cookieHeader,
      },
    })

    if (!response.ok) throw new Error()

    const data = await response.json()
    if (!data.data || data.data.length === 0) throw new Error()

    let best: any = null
    let bestScore = 0
    let bestExact = false

    for (const item of data.data) {
      const combinedText = `${item.ref} ${item.designation}`
      const { score, exactMatch } = scoreMatch(combinedText, q)

      if (score > bestScore) {
        best = item
        bestScore = score
        bestExact = exactMatch
      }
    }

    if (!best) throw new Error()

    results.push({
      supplier: 'Sodimas',
      title: best.designation || best.ref,
      description: best.designation,
      reference: best.ref,
      image:
        best.photo && best.photo !== ''
          ? `https://my.sodimas.com/${best.photo}`
          : null,
      fallbackImage:
        'https://my.sodimas.com/home/assets/img/com/logo.png',
      link: `https://my.sodimas.com/fr/produit?ref=${best.ref}`,
      score: bestScore,
      exactMatch: bestExact,
    })
  } catch {
    results.push({
      supplier: 'Sodimas',
      title: 'Catalogue officiel Sodimas',
      description: 'Recherche dans le catalogue Sodimas.',
      reference: null,
      image: null,
      fallbackImage:
        'https://my.sodimas.com/home/assets/img/com/logo.png',
      link: `https://my.sodimas.com/fr/recherche?searchstring=${encodeURIComponent(
        q
      )}`,
      score: 0,
      exactMatch: false,
    })
  }

  /* =========================================================
     🔹 ELVACENTER — V2 INTELLIGENT SCORING
     ========================================================= */

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
        bestMatch = { link, score, exactMatch }
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
      score: bestMatch.score,
      exactMatch: bestMatch.exactMatch,
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
      score: 0,
      exactMatch: false,
    })
  }

  // 🔥 TRI GLOBAL TYPE GOOGLE
  results.sort((a, b) => b.score - a.score)

  return res.status(200).json(results)
}
