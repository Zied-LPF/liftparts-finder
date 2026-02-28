// lib/connectors/elevatorshop.ts
import puppeteer from 'puppeteer'
import type { SupplierResult } from '../types'

export async function searchElevatorshop(query: string): Promise<SupplierResult[]> {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  })

  const page = await browser.newPage()

  try {
    // Bloque les ressources inutiles pour accélérer
    await page.setRequestInterception(true)
    page.on('request', req => {
      const type = req.resourceType()
      if (['stylesheet', 'font', 'media'].includes(type)) {
        req.abort()
      } else {
        req.continue()
      }
    })

    // Appel direct URL de recherche
    await page.goto(
      `https://www.elevatorshop.de/fr/search?search=${encodeURIComponent(query)}`,
      { waitUntil: 'domcontentloaded' }
    )

    // Attend les produits
    await page.waitForSelector('.product-box', { timeout: 10000 })

    // Scraping stable via evaluate
    const results = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.product-box'))
      return items.slice(0, 20).map(card => {
        const titleEl = card.querySelector('.product-name') as HTMLAnchorElement
        const linkEl = card.querySelector('.product-image-link') as HTMLAnchorElement
        const imgEl = card.querySelector('.product-image-wrapper img') as HTMLImageElement
        const refEl = card.querySelector('.product-artikelnr')
        const stockEl = card.querySelector('.badge-success')

        const reference = refEl?.textContent?.match(/\d+/)?.[0] || ''
        const stock = stockEl?.textContent?.trim() || ''

        // ✅ URL produit pour le front-end : renommé en `link`
        const link = linkEl?.href || titleEl?.href || (reference ? `https://www.elevatorshop.de/fr/search?search=${reference}` : '')

        return {
          supplier: 'ElevatorShop',
          title: titleEl?.textContent?.trim() || '',
          link,          // <- ici le changement important
          image: imgEl?.src || '',
          reference,
          stock
        }
      })
    })

    console.log('Elevatorshop parsed:', results.length)

    return results
  } catch (err) {
    console.error('Elevatorshop Puppeteer error:', err)
    return []
  } finally {
    await browser.close()
  }
}