import type { SupplierResult } from '../types'

let puppeteer: typeof import('puppeteer') | typeof import('puppeteer-core')
let executablePath: string | undefined
let args: string[] | undefined
let defaultViewport: any

export async function searchElevatorshop(query: string): Promise<SupplierResult[]> {
  if (process.env.VERCEL) {
    puppeteer = require('puppeteer-core')
    const chromium = require('@sparticuz/chromium')
    executablePath = await chromium.executablePath()
    args = chromium.args
    defaultViewport = chromium.defaultViewport
  } else {
    puppeteer = require('puppeteer')
    executablePath = undefined
    args = ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    defaultViewport = undefined
  }

  const browser = await puppeteer.launch({
    headless: true,
    args,
    defaultViewport,
    executablePath,
  })

  try {
    const page = await browser.newPage()
    await page.setRequestInterception(true)
    ;(page as any).on('request', (req: any) => {
      const type = req.resourceType()
      if (['stylesheet', 'font', 'media'].includes(type)) req.abort()
      else req.continue()
    })

    // 🚀 Détecter le nombre total de pages
    await page.goto(`https://www.elevatorshop.de/fr/search?search=${encodeURIComponent(query)}`, { waitUntil: 'domcontentloaded' })
    const totalPages: number = await (page as any).evaluate(() => {
      const paginationEls = Array.from(document.querySelectorAll('.pagination a')) as HTMLAnchorElement[]
      const pageNumbers = paginationEls.map(el => parseInt(el.textContent || '')).filter(n => !isNaN(n))
      return pageNumbers.length ? Math.max(...pageNumbers) : 1
    })

    console.log('Elevatorshop total pages:', totalPages)

    // 🔥 Créer des pages parallèles pour accélérer le scraping
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    const resultsArrays: SupplierResult[][] = await Promise.all(
      pageNumbers.map(async (pNum) => {
        const p = await browser.newPage()
        await p.setRequestInterception(true)
        ;(p as any).on('request', (req: any) => {
          const type = req.resourceType()
          if (['stylesheet', 'font', 'media'].includes(type)) req.abort()
          else req.continue()
        })
        const url = `https://www.elevatorshop.de/fr/search?search=${encodeURIComponent(query)}&page=${pNum}`
        await p.goto(url, { waitUntil: 'domcontentloaded' }).catch(() => {})
        const pageResults: SupplierResult[] = await (p as any).evaluate(() => {
          const items = Array.from(document.querySelectorAll('.product-box'))
          return items.map((card: any) => {
            const titleEl = card.querySelector('.product-name')
            const linkEl = card.querySelector('.product-image-link')
            const imgEl = card.querySelector('.product-image-wrapper img')
            const refEl = card.querySelector('.product-artikelnr')
            const stockEl = card.querySelector('.badge-success')

            const reference = refEl?.textContent?.match(/\d+/)?.[0] || ''
            const stock = stockEl?.textContent?.trim() || ''
            const link =
              linkEl?.href ||
              titleEl?.href ||
              (reference ? `https://www.elevatorshop.de/fr/search?search=${reference}` : '')

            return {
              supplier: 'ElevatorShop',
              title: titleEl?.textContent?.trim() || '',
              link,
              image: imgEl?.src || '',
              reference,
              stock,
            }
          })
        })
        await p.close()
        return pageResults
      })
    )

    const allResults = resultsArrays.flat()
    console.log('Elevatorshop total parsed:', allResults.length)
    return allResults
  } catch (err) {
    console.error('Elevatorshop Puppeteer error:', err)
    return []
  } finally {
    await browser.close()
  }
}