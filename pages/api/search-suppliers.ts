// pages/api/search-suppliers.ts
import type { NextApiRequest, NextApiResponse } from "next"
import fetch from "node-fetch"
import * as cheerio from "cheerio"

type SupplierResult = {
  supplier: string
  title: string
  reference: string
  link: string
  image: string | null
  fallbackImage: string
  score: number
  exactMatch: boolean
  fromGoogle: boolean
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

const suppliers = [
  { name: "Sodimas", baseUrl: "https://my.sodimas.com/fr/recherche?searchstring=", brands: ["Sodimas"] },
  { name: "Elvacenter", baseUrl: "https://shop.elvacenter.com/#/dfclassic/query=" },
  { name: "Hauer", baseUrl: "https://www.elevatorshop.de/fr#/dfclassic/query=" },
  { name: "Kone", baseUrl: "https://parts.kone.com/#/!1@&searchTerm=", brands: ["Kone"] },
  { name: "MGTI", baseUrl: "https://www.mgti.fr/PBSearch.asp?ActionID=1&CCode=2&ShowSMImg=1&SearchText=" },
  { name: "Sodica", baseUrl: "https://www.sodica.fr/fr/search?SearchTerm=" },
  { name: "RS", baseUrl: "https://befr.rs-online.com/web/c/?searchTerm=" },
  { name: "Cebeo", baseUrl: "https://www.cebeo.be/catalog/fr-be/search/" },
]

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = (req.query.q as string)?.trim()
  if (!q) return res.status(400).json({ error: "Query manquante" })

  const results: SupplierResult[] = []

  for (const supplier of suppliers) {
    try {
      const url = `${supplier.baseUrl}${encodeURIComponent(q)}`
      const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } })
      const html = await response.text()
      const $ = cheerio.load(html)

      let bestMatch: any = null

      // On ne prend que les textes qui contiennent explicitement le mot clé
      $("a, h2, h3, .product-title, .produit").each((_, el) => {
        const title = $(el).text().trim()
        if (!title) return

        const { score, exactMatch } = scoreMatch(title, q)
        // Ne garder que si score > 0 (donc le mot clé est présent)
        if (score > 0 && (!bestMatch || score > bestMatch.score)) {
          const link = $(el).attr("href") || url
          bestMatch = { title, link, score, exactMatch }
        }
      })

      if (bestMatch) {
        results.push({
          supplier: supplier.name,
          title: bestMatch.title,
          reference: bestMatch.title,
          link: bestMatch.link.startsWith("http") ? bestMatch.link : supplier.baseUrl,
          image: null,
          fallbackImage: "/no-image.png",
          score: bestMatch.score,
          exactMatch: bestMatch.exactMatch,
          fromGoogle: false,
        })
      }
    } catch (err) {
      console.error(`Erreur scraping ${supplier.name}:`, err)
    }
  }

  // Recherche Google
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
  const GOOGLE_CX = process.env.GOOGLE_CX

  if (GOOGLE_API_KEY && GOOGLE_CX) {
    try {
      const googleRes = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&q=${encodeURIComponent(q)}`
      )
      const googleData = await googleRes.json()

      if (googleData.items && googleData.items.length > 0) {
        googleData.items.forEach((item: any) => {
          results.push({
            supplier: "Google",
            title: item.title,
            reference: item.title,
            link: item.link,
            image: item.pagemap?.cse_image?.[0]?.src || null,
            fallbackImage: "/no-image.png",
            score: 10,
            exactMatch: false,
            fromGoogle: true,
          })
        })
      }
    } catch (err) {
      console.error("Erreur Google API:", err)
    }
  }

  results.sort((a, b) => b.score - a.score)
  return res.status(200).json(results)
}
