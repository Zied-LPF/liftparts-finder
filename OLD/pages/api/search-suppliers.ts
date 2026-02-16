// pages/api/search-suppliers.ts
import type { NextApiRequest, NextApiResponse } from "next"

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

const suppliers = [
  { name: "Sodimas", site: "my.sodimas.com" },
  { name: "Elvacenter", site: "shop.elvacenter.com" },
  { name: "Hauer", site: "www.elevatorshop.de" },
  { name: "Kone", site: "parts.kone.com" },
  { name: "MGTI", site: "www.mgti.fr" },
  { name: "Sodica", site: "www.sodica.fr" },
  { name: "RS", site: "befr.rs-online.com" },
  { name: "Cebeo", site: "www.cebeo.be" },
]

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = (req.query.q as string)?.trim()
  if (!q) return res.status(400).json({ error: "Query manquante" })

  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
  const GOOGLE_CX = process.env.GOOGLE_CX
  if (!GOOGLE_API_KEY || !GOOGLE_CX) return res.status(400).json({ error: "Google API key ou CX manquant" })

  const results: SupplierResult[] = []

  for (const supplier of suppliers) {
    try {
      const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&q=${encodeURIComponent(q)}+site:${supplier.site}`
      const r = await fetch(url)
      const data = await r.json()

      if (data.items && data.items.length > 0) {
        data.items.forEach((item: any) => {
          const { score, exactMatch } = scoreMatch(item.title || "", q)
          results.push({
            supplier: supplier.name,
            title: item.title,
            reference: item.title,
            link: item.link,
            image: item.pagemap?.cse_image?.[0]?.src || null,
            fallbackImage: "/no-image.png",
            score,
            exactMatch,
            fromGoogle: true,
          })
        })
      }
    } catch (err) {
      console.error(`Erreur Google API pour ${supplier.name}:`, err)
    }
  }

  // Tri par score
  results.sort((a, b) => b.score - a.score)

  res.status(200).json(results)
}
