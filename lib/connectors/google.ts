// lib/connectors/google.ts
import type { SupplierResult } from "../types"

const API_KEY = process.env.GOOGLE_CSE_API_KEY
const CX = process.env.GOOGLE_CSE_CX

export async function searchGoogle(
  query: string,
  page: number = 1
): Promise<{ results: SupplierResult[]; hasMore: boolean }> {

  if (!API_KEY || !CX) {
    console.error("Google CSE: clés manquantes dans .env")
    return { results: [], hasMore: false }
  }

  try {
    // Google CSE : 10 résultats par page, start = index du premier résultat
    const start = (page - 1) * 10 + 1
    const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(query + " ascenseur pièce")}&start=${start}&num=10&hl=fr`

    const res = await fetch(url)

    if (!res.ok) {
      const err = await res.text()
      console.error("Google CSE error:", res.status, err)
      return { results: [], hasMore: false }
    }

    const data = await res.json()
    const items: any[] = data.items || []

    const results: SupplierResult[] = items.map((item: any) => {
      // Image : depuis pagemap.cse_image ou pagemap.cse_thumbnail
      const image =
        item.pagemap?.cse_image?.[0]?.src ||
        item.pagemap?.cse_thumbnail?.[0]?.src ||
        ""

      return {
        supplier: "Google",
        title: item.title || "",
        designation: item.title || "",
        reference: "",
        image,
        stock: undefined,
        link: item.link || "",
        source: item.displayLink || ""
      } as SupplierResult
    })

    // Google CSE retourne au max 100 résultats (10 pages de 10)
    const totalResults = parseInt(data.searchInformation?.totalResults || "0", 10)
    const hasMore = start + 10 <= Math.min(totalResults, 100)

    console.log(`Google CSE page ${page} → ${results.length} résultats (total: ${totalResults})`)

    return { results, hasMore }

  } catch (err) {
    console.error("Google CSE search error:", err)
    return { results: [], hasMore: false }
  }
}
