import type { SupplierResult } from '../types'

const HAUER_HASHID = '5836afe245ee8e1cd4c7de5e0ccb1bdb'

export async function searchHauer(query: string): Promise<SupplierResult[]> {
  try {
    const url = `https://eu1-search.doofinder.com/5/search?hashid=${HAUER_HASHID}&query=${encodeURIComponent(
      query
    )}&rpp=20&page=1&transformer=basic`

    const res = await fetch(url, {
      headers: {
        // User-Agent réaliste pour éviter le 403
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
        // Referrer pour imiter le navigateur
        'Referer': 'https://www.elevatorshop.de/',
        'Accept': 'application/json,text/plain,*/*'
      }
    })

    if (!res.ok) {
      console.error('Doofinder HTTP error:', res.status)
      return []
    }

    const data = await res.json()

    if (!data?.results || !Array.isArray(data.results)) {
      return []
    }

    const results: SupplierResult[] = data.results.map((item: any) => ({
      supplier: 'Hauer',
      title: item.title || item.product_name || 'Produit Hauer',
      designation: item.title || '',
      brand: item.brand || '',
      reference: item.reference || item.title || '',
      url: item.link || item.url || '',
      image:
        item.image_link
          ? item.image_link.startsWith('http')
            ? item.image_link
            : `https:${item.image_link}`
          : '/logos/image-fallback.png',
      price: item.price || null,
      source: 'Doofinder'
    }))

    return results
  } catch (err) {
    console.error('Doofinder fetch error:', err)
    return []
  }
}