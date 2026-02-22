import type { SupplierResult } from '../types.ts'

const HASHID = process.env.NEXT_PUBLIC_DOOFINDER_HASHID!
const API_KEY = process.env.NEXT_PUBLIC_DOOFINDER_API_KEY!

export async function scrapeDoofinder(query: string): Promise<SupplierResult[]> {
  const url = `https://apiv2.doofinder.com/search/${HASHID}/query/${encodeURIComponent(query)}?key=${API_KEY}`
  const res = await fetch(url)
  const data = await res.json()
  const results: SupplierResult[] = []

  if (Array.isArray(data.records)) {
    for (const r of data.records) {
      results.push({
        title: r.title,
        reference: r.reference || r.title,
        brand: r.brand || '',
        supplier: r.supplier || 'Doofinder',
        link: r.url,
        price: r.price || 0,
        source: 'Doofinder'
      })
    }
  }

  return results
}