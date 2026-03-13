import type { SupplierResult } from "../types"

const HASHID = "1824a3f07157f932fdf54d53265f4bc5"

export async function searchElvacenter(
  query: string,
  page: number = 1
): Promise<{ results: SupplierResult[]; hasMore: boolean }> {

  try {

    const url =
      `https://eu1-search.doofinder.com/5/search` +
      `?hashid=${HASHID}` +
      `&query=${encodeURIComponent(query)}` +
      `&page=${page}` +
      `&rpp=30` +
      `&query_name=match_and`

    const res = await fetch(url, {
      headers: {
        accept: "*/*",
        origin: "https://shop.elvacenter.com",
        referer: "https://shop.elvacenter.com/",
        "user-agent": "Mozilla/5.0"
      }
    })

    if (!res.ok) {
      console.error("Elvacenter API error:", res.status)
      return { results: [], hasMore: false }
    }

    const data = await res.json()

    const results: SupplierResult[] = (data.results || []).map((item: any) => ({
      supplier: "Elvacenter",
      title: item.title2 || item.title || "",
      reference: item.gtin || item.oem || "",
      image: item.image_link || "",
      stock: item.availability || "",
      link: item.link || ""
    }))

    const hasMore = results.length === 30

    return { results, hasMore }

  } catch (err) {

    console.error("Elvacenter search error:", err)

    return { results: [], hasMore: false }

  }
}