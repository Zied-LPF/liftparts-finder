// lib/connectors/mysodimas.ts
import type { SupplierResult } from '../types'

export async function searchMySodimas(
  query: string,
  pageNumber: number = 1,
  perPage: number = 20
): Promise<{ results: SupplierResult[]; hasMore: boolean }> {

  function cleanStock(html: string): string {
    if (!html) return ''
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  // 🔹 Déterminer la "taille" de la requête pour la page courante
  const start = (pageNumber - 1) * perPage
  const url = new URL('https://my.sodimas.com/index.cfm')
  url.searchParams.set('action', 'search.jsonList')
  url.searchParams.set('filtrePrincipal', 'searchstring')
  url.searchParams.set('filtrePrincipalValue', query)
  url.searchParams.set('searchstring', query)
  url.searchParams.set('draw', '1')
  url.searchParams.set('start', start.toString())
  url.searchParams.set('length', perPage.toString())

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
  const items = Array.isArray(json.data) ? json.data : []
  const totalFiltered = json.recordsFiltered ?? 0

  const results: SupplierResult[] = items.map((item: any) => {
    const ref = item.ref || ''
    const designation = item.designation?.trim() || ''

    const link = `https://my.sodimas.com/fr/recherche?searchstring=${encodeURIComponent(ref || query)}`
    const image = ref
      ? `https://my.sodimas.com/data/produits/thumbnail/dt/${ref}.jpg`
      : ''

    return {
      reference: ref,
      title: designation,
      designation: designation,
      stock: cleanStock(item.stock),
      supplier: 'MySodimas',
      link,
      source: 'MySodimas',
      brand: item.brand?.trim() || '',
      image
    }
  })

  const hasMore = start + items.length < totalFiltered
  return { results, hasMore }
}