// lib/connectors/sodica.ts
import type { SupplierResult } from '../types'
import fetch from 'node-fetch'

export async function fetchSodica(query: string): Promise<SupplierResult[]> {
  const url = `https://www.sodica.fr/recherche?q=${encodeURIComponent(query)}`
  const res = await fetch(url)
  const html = await res.text()

  const cheerio = await import('cheerio')
  const $ = cheerio.load(html)

  const results: SupplierResult[] = []

  $('.product-item').each((_, el) => {
    const item = $(el)

    const title = item.find('.product-title').text().trim()
    const ref = item.find('.product-ref').text().trim()
    const priceText = item.find('.product-price').text().replace(/[^\d.,]/g, '').replace(',', '.')
    const price = priceText ? Number(priceText) : undefined
    const link = item.find('a.product-link').attr('href') || ''
    const image = item.find('img.product-image').attr('src') || undefined
    const stock = item.find('.product-stock').text().trim() || undefined

    results.push({
      supplier: 'Sodica',
      reference: ref || undefined,
      title,
      price,
      link: link.startsWith('http') ? link : `https://sodica.fr${link}`,
      image,
      stock,
      designation: title
    })
  })

  return results
}