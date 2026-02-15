import type { NextApiRequest, NextApiResponse } from "next"

type SupplierResult = {
  supplier: string
  title: string
  description: string
  reference: string
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
  if (t === q) { score += 50; exactMatch = true }
  if (t.startsWith(q)) score += 25
  if (t.includes(q)) score += 15
  query.split(" ").forEach(word => { if (t.includes(normalize(word))) score += 4 })
  return { score, exactMatch }
}

const FALLBACK_SUPPLIERS = [
  { name: "Sodimas", urlPrefix: "my.sodimas.com" },
  { name: "Otis", urlPrefix: "www.otis.com" },
  { name: "Schindler", urlPrefix: "www.schindler.com" },
]

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = (req.query.q as string)?.trim()
  if (!q) return res.status(400).json({ error: "Query manquante" })

  const results: SupplierResult[] = []

  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
  const GOOGLE_CX = process.env.GOOGLE_CX

  if (!GOOGLE_API_KEY || !GOOGLE_CX) {
    return res.status(500).json({ error: "Google API key ou CX manquant" })
  }

  try {
    for (const supplier of FALLBACK_SUPPLIERS) {
      const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&q=${encodeURIComponent(q)}+site:${supplier.urlPrefix}`
      const response = await fetch(searchUrl)
      const data = await response.json()

      if (data.items?.length) {
        data.items.forEach((item: any) => {
          const title = item.title || ""
          const link = item.link || ""
          const image = item.pagemap?.cse_image?.[0]?.src || null
          const { score, exactMatch } = scoreMatch(title, q)
          results.push({
            supplier: supplier.name,
            title,
            description: title,
            reference: title,
            image,
            fallbackImage: "/no-image.png",
            link,
            score,
            exactMatch
          })
        })
      }
    }

    results.sort((a, b) => b.score - a.score)
    return res.status(200).json(results)

  } catch (err) {
    console.error("Google multi-supplier search error:", err)
    return res.status(500).json({ error: "Erreur Google search multi-fournisseurs" })
  }
}
