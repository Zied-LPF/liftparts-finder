import type { NextApiRequest, NextApiResponse } from "next"
import * as cheerio from "cheerio"

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
  return str.toLowerCase().replace(/[\s\-_/]/g, "")
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
  if (t.startsWith(q)) score += 25
  if (t.includes(q)) score += 15

  query.split(" ").forEach((word) => {
    if (t.includes(normalize(word))) score += 4
  })

  return { score, exactMatch }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const q = (req.query.q as string)?.trim()
  if (!q) return res.status(400).json({ error: "Query manquante" })

  const results: SupplierResult[] = []

  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
  const GOOGLE_CX = process.env.GOOGLE_CX

  /* ====================== GOOGLE SEARCH ====================== */
  if (GOOGLE_API_KEY && GOOGLE_CX) {
    try {
      const googleUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&q=${encodeURIComponent(
        q
      )}`

      const response = await fetch(googleUrl)
      const data = await response.json()

      if (data.items?.length) {
        let bestMatch: any = null

        data.items.forEach((item: any) => {
          const title = item.title || ""
          const link = item.link || ""
          const image =
            item.pagemap?.cse_image?.[0]?.src ||
            null

          const { score, exactMatch } = scoreMatch(title, q)

          if (!bestMatch || score > bestMatch.score) {
            bestMatch = { title, link, image, score, exactMatch }
          }
        })

        if (bestMatch) {
          results.push({
            supplier: "Google",
            title: bestMatch.title,
            description: bestMatch.title,
            reference: bestMatch.title,
            image: bestMatch.image,
            fallbackImage: "/no-image.png",
            link: bestMatch.link,
            score: bestMatch.score,
            exactMatch: bestMatch.exactMatch,
          })
        }
      }
    } catch (err) {
      console.error("Google search error:", err)
    }
  }

  /* ====================== SODIMAS SCRAPING (fallback) ====================== */
  if (results.length === 0) {
    try {
      const searchUrl = `https://my.sodimas.com/fr/recherche?searchstring=${encodeURIComponent(
        q
      )}`

      const response = await fetch(searchUrl, {
        headers: { "User-Agent": "Mozilla/5.0" },
      })
      const html = await response.text()
      const $ = cheerio.load(html)

      let bestMatch: any = null

      $(".product-item, .produit, .product").each((_, el) => {
        const title = $(el)
          .find(".product-title, h2, h3")
          .text()
          .trim()
        const link = $(el).find("a").attr("href") || null
        const image = $(el).find("img").attr("src") || null
        if (!title || !link) return

        const { score, exactMatch } = scoreMatch(title, q)

        if (!bestMatch || score > bestMatch.score) {
          bestMatch = {
            title,
            link: link.startsWith("http")
              ? link
              : `https://my.sodimas.com${link}`,
            image: image
              ? image.startsWith("http")
                ? image
                : `https://my.sodimas.com${image}`
              : null,
            score,
            exactMatch,
          }
        }
      })

      if (bestMatch) {
        results.push({
          supplier: "Sodimas",
          title: bestMatch.title,
          description: bestMatch.title,
          reference: bestMatch.title,
          image: bestMatch.image,
          fallbackImage:
            "https://my.sodimas.com/home/assets/img/com/logo.png",
          link: bestMatch.link,
          score: bestMatch.score,
          exactMatch: bestMatch.exactMatch,
        })
      }
    } catch (err) {
      console.error("Sodimas scraping error:", err)
    }
  }

  results.sort((a, b) => b.score - a.score)
  return res.status(200).json(results)
}
