// lib/connectors/doofinder.ts
import fetch from "node-fetch"
import { SupplierResult } from "../types"

const HASHID = process.env.NEXT_PUBLIC_DOOFINDER_HASHID
const API_KEY = process.env.NEXT_PUBLIC_DOOFINDER_API_KEY

export async function fetchDoofinder(query: string): Promise<SupplierResult[]> {
  if (!HASHID || !API_KEY) {
    console.warn("⚠️ Doofinder non configuré")
    return []
  }

  const url = `https://api.doofinder.com/v2/search/${HASHID}?q=${encodeURIComponent(query)}`
  const res = await fetch(url, {
    headers: {
      "Authorization": `Token ${API_KEY}`,
      "Content-Type": "application/json",
    },
  })

  if (!res.ok) {
    console.error("❌ Erreur Doofinder", res.statusText)
    return []
  }

  const data = await res.json()
  const results: SupplierResult[] = []

  // Doofinder retourne "records" avec "title" et "url"
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
