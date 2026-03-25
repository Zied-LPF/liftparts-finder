// lib/connectors/hissmekano.ts
import type { SupplierResult } from "../types"

const PAGE_SIZE = 50
const BASE_URL = "https://hissmekano.com"
const API_IMG = "https://api.hissmekano.se/v2/product/get-akeneo-file?code="

// Cache du mapping assetID → mediaDownloadParms
let imageMapCache: Record<number, string> | null = null
let imageMapFetchedAt = 0
const CACHE_TTL = 1000 * 60 * 60 // 1h

async function getImageMap(): Promise<Record<number, string>> {
  const now = Date.now()
  if (imageMapCache && now - imageMapFetchedAt < CACHE_TTL) {
    return imageMapCache
  }

  try {
    const res = await fetch(`${BASE_URL}/api/v2/Product/get-product-filter-setup`, {
      method: "GET",
      headers: {
        "accept": "application/json",
        "origin": BASE_URL,
        "referer": `${BASE_URL}/`,
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    })

    if (!res.ok) {
      console.error("Hissmekano filter-setup error:", res.status)
      return {}
    }

    const data = await res.json()
    const raw: Record<string, { aknAssetID: number; mediaDownloadParms: string }> =
      data.imagesByAssetID ?? {}

    const map: Record<number, string> = {}
    for (const entry of Object.values(raw)) {
      map[entry.aknAssetID] = entry.mediaDownloadParms
    }

    imageMapCache = map
    imageMapFetchedAt = now
    console.log(`Hissmekano image map loaded: ${Object.keys(map).length} assets`)
    return map

  } catch (err) {
    console.error("Hissmekano getImageMap error:", err)
    return {}
  }
}

export async function searchHissmekano(
  query: string,
  page: number = 1
): Promise<{ results: SupplierResult[]; hasMore: boolean }> {

  try {
    const [searchRes, imageMap] = await Promise.all([
      fetch(`${BASE_URL}/api/v2/Product/filter-products`, {
        method: "POST",
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
          "origin": BASE_URL,
          "referer": `${BASE_URL}/`,
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        },
        body: JSON.stringify({
          resultsPageSize: PAGE_SIZE,
          searchString: query,
          language: 1,
          productSort: 4,
          page: page
        })
      }),
      getImageMap()
    ])

    if (!searchRes.ok) {
      console.error("Hissmekano API error:", searchRes.status)
      return { results: [], hasMore: false }
    }

    const data = await searchRes.json()
    const items: any[] = Array.isArray(data.topResults) ? data.topResults : []

    const results: SupplierResult[] = items.map((item: any) => {

      // Prix
      const priceEntry = item.stockInfo?.prices?.find((p: any) => p.key === -1)
      const price = priceEntry?.price ?? undefined

      // Stock
      const stockInfos: any[] = item.stockInfo?.stockInfos ?? []
      const inStock = stockInfos.some((s: any) => s.quantity > 0)
      const stock = stockInfos.length > 0
        ? (inStock ? "En stock" : "backorder")
        : undefined

      // Référence
      const articleNr =
        item.attributes?.strings?.["7"] ||
        item.attributes?.articleNr ||
        item.id?.toString() ||
        ""

      // Image via imageMap
      const imageAssetIDs: number[] = item.attributes?.imageAssetIDs?.["3"] ?? []
      const imageAssetID = imageAssetIDs[0] ?? null
      const mediaCode = imageAssetID ? imageMap[imageAssetID] : null
      const image = mediaCode ? `${API_IMG}${encodeURIComponent(mediaCode)}` : ""

      // Lien
      const link = item.id ? `${BASE_URL}/product/${item.id}` : BASE_URL

      return {
        supplier: "Hissmekano",
        title: item.label || item.name || "",
        designation: item.label || item.name || "",
        reference: articleNr,
        image,
        stock,
        price,
        link
      } as SupplierResult
    })

    const totalCount = Array.isArray(data.allMatchingProductIDs)
      ? data.allMatchingProductIDs.length : 0
    const hasMore = totalCount > page * PAGE_SIZE

    return { results, hasMore }

  } catch (err) {
    console.error("Hissmekano search error:", err)
    return { results: [], hasMore: false }
  }
}
