// lib/connectors/mysodimas.ts
import type { SupplierResult } from '../types'

export async function searchMySodimas(query: string): Promise<SupplierResult[]> {

  function cleanStock(html: string): string {
    if (!html) return ''
    return html
      .replace(/<[^>]*>/g, '')   // supprime toutes les balises
      .replace(/\s+/g, ' ')      // supprime espaces multiples
      .trim()
  }

  const url = new URL('https://my.sodimas.com/index.cfm')
  url.searchParams.set('action', 'search.jsonList')
  url.searchParams.set('filtrePrincipal', 'searchstring')
  url.searchParams.set('filtrePrincipalValue', query)
  url.searchParams.set('searchstring', query)
  url.searchParams.set('draw', '1')
  url.searchParams.set('start', '0')
  url.searchParams.set('length', '50')

  const res = await fetch(url.toString(), {
    headers: {
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  })

  if (!res.ok) {
    throw new Error(`Sodimas API error: ${res.status}`)
  }

  const json = await res.json()
  if (!json.data || !Array.isArray(json.data)) return []

  return json.data.map((item: any) => {
    const ref = item.ref || ''

    // 🔹 Lien vers recherche MySodimas
    const link = `https://my.sodimas.com/fr/recherche?searchstring=${encodeURIComponent(ref || query)}`

    // 🔥 Construction image basée sur référence numérique
    const image = ref
      ? `https://my.sodimas.com/data/produits/thumbnail/dt/${ref}.jpg`
      : ''

    console.log('Sodimas image URL:', image)

    return {
      reference: ref,
      designation: item.designation?.trim() || '',
      stock: cleanStock(item.stock),
      supplier: 'MySodimas',
      link,
      source: 'MySodimas',
      brand: item.brand?.trim() || '',
      image
    }
  })
}