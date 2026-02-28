// lib/connectors/hauer.ts
import type { SupplierResult } from '../types'

export async function searchHauer(query: string): Promise<SupplierResult[]> {
  const baseUrl = 'https://eu1-search.doofinder.com/5/options/5836afe245ee8e1cd4c7de5e0ccb1bdb'
  const url = `${baseUrl}?q=${encodeURIComponent(query)}&www.elevatorshop.de&rpp=50`

  try {
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Origin': 'https://www.elevatorshop.de',
        'Referer': 'https://www.elevatorshop.de/'
      }
    })

    if (!res.ok) {
      throw new Error(`Hauer Doofinder error: ${res.status}`)
    }

    const data = await res.json()

    // Transforme en SupplierResult
    const results: SupplierResult[] = (data.results || []).map((r: any) => ({
      title: r.title || r.designation || 'Produit Hauer',
      image: r.image?.startsWith('http') ? r.image : `https:${r.image}` || '/logos/image-fallback.png',
      url: r.url || '#',
      supplier: 'Hauer',
      reference: r.reference || ''
    }))

    console.log('Hauer count:', results.length)
    return results
  } catch (err) {
    console.error('Hauer error:', err)
    return []
  }
}