// lib/connectors/sodica.ts
import { chromium } from 'playwright'
import { SupplierResult } from '../types'

export async function searchSodica(query: string): Promise<SupplierResult[]> {
  const results: SupplierResult[] = []
  const baseUrl = 'https://sodica.fr/search'

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  try {
    const url = `${baseUrl}?SearchTerm=${encodeURIComponent(query)}`
    await page.goto(url, { waitUntil: 'domcontentloaded' })

    // Attendre la présence des cartes produits (nouvelle structure DOM)
    await page.waitForSelector('.card', { timeout: 15000 })

    const items = await page.$$eval('.card', elems =>
      elems.map(el => {
        const refEl = el.querySelector('[data-ref]')
        const titleEl = el.querySelector('.card-title')
        const priceEl = el.querySelector('.price')
        const linkEl = el.querySelector('a')

        const ref = refEl?.textContent?.trim() || ''
        const title = titleEl?.textContent?.trim() || ref
        const price = priceEl?.textContent?.trim() || undefined
        const url = linkEl?.getAttribute('href') || '#'

        return { ref, title, price, url }
      })
    )

    items.forEach(item => {
      if (item.ref) {
       results.push({
  supplier: 'Sodica',
  reference: item.ref,
  title: item.title,
  price: item.price ? Number(item.price) : undefined, // 🔹 conversion string → number
  url: item.url.startsWith('http') ? item.url : `https://sodica.fr${item.url}`
})
      }
    })
  } catch (err) {
    console.error('Sodica Playwright error:', err)
  } finally {
    await browser.close()
  }

  return results
}