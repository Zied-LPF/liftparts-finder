import fetch from "node-fetch"
import { SupplierResult } from "../types"

const HASHID = process.env.NEXT_PUBLIC_DOOFINDER_HASHID
const API_KEY = process.env.NEXT_PUBLIC_DOOFINDER_API_KEY

export async function fetchDoofinder(query: string): Promise<SupplierResult[]> {
  if (!HASHID || !API_KEY) return []

  const res = await fetch(`https://api.doofinder.com/v2/search/${HASHID}?q=${encodeURIComponent(query)}`, {
    headers: { "Authorization": `Token ${API_KEY}`, "Content-Type": "application/json" }
  })

  if (!res.ok) return []

  const data = await res.json()
  const results: SupplierResult[] = []

  if (data?.records) {
    data.records.forEach((r: any) => {
      results.push({
        supplier: r.supplier || "Doofinder",
        title: r.title,
        reference: r.reference || r.title,
        link: r.url,
        price: r.price,
        brand: r.brand,
        source: "Doofinder",
      })
    })
  }

  return results
}
