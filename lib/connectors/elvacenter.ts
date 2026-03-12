import type { SupplierResult } from "../types"
import puppeteer, { Browser, Page } from "puppeteer"

export async function searchElvacenter(
  query: string,
  startIndex: number = 0,
  limit: number = 30
): Promise<{ results: SupplierResult[], hasMore: boolean }> {
  const results: SupplierResult[] = []

  let browser: Browser | null = null
  let executablePath: string | undefined
  let args: string[] = ["--no-sandbox", "--disable-setuid-sandbox"] // déclaration avant usage

  if (process.env.VERCEL) {
    const chromium = require("@sparticuz/chromium")
    executablePath = await chromium.executablePath()
    args.push(...chromium.args)
  }

  try {
    browser = await puppeteer.launch({
      headless: true,
      args,
      executablePath,
    })

    const page: Page = await browser.newPage()

    // 🔹 Bloquer images, CSS, fonts pour accélérer
    await page.setRequestInterception(true)
    page.on("request", (req) => {
      const type = req.resourceType()
      if (type === "image" || type === "stylesheet" || type === "font") {
        req.abort()
      } else {
        req.continue()
      }
    })

    const searchUrl = `https://shop.elvacenter.com/fr/#/dfclassic/query=${encodeURIComponent(query)}`
    await page.goto(searchUrl, { waitUntil: "networkidle2" })

    const containerSelector = "#df-results__dfclassic"
    await page.waitForSelector(containerSelector, { timeout: 5000 })

    let previousCount = startIndex
    let hasMore = true

    while (hasMore) {
      // Scroll plus large
      await page.evaluate((selector) => {
        const container = document.querySelector(selector)
        if (container) container.scrollBy(0, 1500)
      }, containerSelector)

      // Attente dynamique que de nouveaux produits apparaissent
      await page.waitForFunction(
        (count) => document.querySelectorAll("div.df-card[data-role='result']").length > count,
        { timeout: 2000 },
        previousCount
      ).catch(() => {})

      // Récupération des produits visibles
      const items = await page.$$eval("div.df-card[data-role='result']", (cards) => {
        return cards.map(card => {
          const titleEl = card.querySelector<HTMLDivElement>("div.df-card__title")
          const skuEl = card.querySelector<HTMLDivElement>("div.df-card__sku")
          const imgEl = card.querySelector<HTMLImageElement>("img")
          const stockEl = card.querySelector<HTMLDivElement>("div.df-card__availability")

          const title = titleEl?.innerText.trim() || ""
          const reference = skuEl?.innerText.trim() || ""
          const image = imgEl?.getAttribute("src") ? `https:${imgEl.getAttribute("src")}` : ""
          const stock = stockEl?.innerText.trim() || ""
          const link = reference ? `https://shop.elvacenter.com/fr/#/dfclassic/query=${reference}` : ""

          return { supplier: "Elvacenter", title, reference, image, stock, link }
        })
      })

      const newItems = items.slice(previousCount, previousCount + limit)
      results.push(...newItems)
      previousCount += newItems.length

      hasMore = newItems.length > 0 && items.length > previousCount
    }

  } catch (err) {
    console.error("Elvacenter search error:", err)
  } finally {
    if (browser) await browser.close()
  }

  return { results, hasMore: results.length > 0 }
}