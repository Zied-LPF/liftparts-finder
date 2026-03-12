// lib/connectors/elvacenter.ts
import type { SupplierResult } from "../types"
import puppeteer, { Browser, Page } from "puppeteer"

export async function searchElvacenter(
  query: string,
  startIndex: number = 0,
  limit: number = 30
): Promise<{ results: SupplierResult[], hasMore: boolean }> {
  const results: SupplierResult[] = []

  let browser: Browser | null = null
  const args: string[] = ["--no-sandbox", "--disable-setuid-sandbox"]

  try {
    // 🔹 Lancer Puppeteer complet en prod et local
    browser = await puppeteer.launch({
      headless: true,
      args,
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

    // 🔹 Timeout plus long pour être sûr que le JS ait rendu toutes les cartes
    await page.waitForSelector(containerSelector, { timeout: 20000 })

    let previousCount = startIndex
    let hasMore = true

    while (hasMore) {
      // 🔹 Scroll du container
      await page.evaluate((selector) => {
        const container = document.querySelector(selector)
        if (container) container.scrollBy(0, 1500)
      }, containerSelector)

      // 🔹 Attente dynamique des nouveaux résultats
      await page.waitForFunction(
        (count) => document.querySelectorAll("div.df-card[data-role='result']").length > count,
        { timeout: 3000 },
        previousCount
      ).catch(() => {})

      // 🔹 Récupération des produits
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