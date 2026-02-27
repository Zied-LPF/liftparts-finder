// lib/connectors/mysodimas.ts
import type { SupplierResult } from '../types'

export async function searchMySodimas(query: string): Promise<SupplierResult[]> {

  function cleanStock(html: string): string {
    if (!html) return ''
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  const PAGE_SIZE = 50
  let start = 0
  let hasMore = true
  let allItems: any[] = []

  while (hasMore) {
    const url = new URL('https://my.sodimas.com/index.cfm')
    url.searchParams.set('action', 'search.jsonList')
    url.searchParams.set('filtrePrincipal', 'searchstring')
    url.searchParams.set('filtrePrincipalValue', query)
    url.searchParams.set('searchstring', query)
    url.searchParams.set('draw', '1')
    url.searchParams.set('start', start.toString())
    url.searchParams.set('length', PAGE_SIZE.toString())

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

    if (!json.data || !Array.isArray(json.data)) break

    allItems.push(...json.data)

    const totalFiltered = json.recordsFiltered ?? null

    // Stop conditions
    if (json.data.length < PAGE_SIZE) {
      hasMore = false
    } else if (totalFiltered && allItems.length >= totalFiltered) {
      hasMore = false
    } else {
      start += PAGE_SIZE
    }

    // Sécurité anti-boucle infinie
    if (start >= 500) {
      hasMore = false
    }
  }

  return allItems.map((item: any) => {
    const ref = item.ref || ''

    const link = `https://my.sodimas.com/fr/recherche?searchstring=${encodeURIComponent(ref || query)}`

    const image = ref
      ? `https://my.sodimas.com/data/produits/thumbnail/dt/${ref}.jpg`
      : ''

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