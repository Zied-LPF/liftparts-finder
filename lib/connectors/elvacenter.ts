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
    browser = await puppeteer.launch({
      headless: true,
      args
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
    // 🔹 timeout plus long pour prod
    await page.waitForSelector(containerSelector, { timeout: 15000 }).catch(() => {})

    // 🔹 récupérer seulement les premières cartes visibles
    const maxCards = 15 // 🔹 limiter pour tenir <10s
    const items = await page.$$eval(
      `div.df-card[data-role='result']`,
      (cards, max) => {
        return cards.slice(0, max).map(card => {
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
      },
      maxCards
    )

    // 🔹 slice avec startIndex/limit pour compatibilité pagination
    const newItems = items.slice(startIndex, startIndex + limit)
    results.push(...newItems)

  } catch (err) {
    console.error("Elvacenter search error:", err)
  } finally {
    if (browser) await browser.close()
  }

  // 🔹 hasMore = vrai si on a rempli le maxCards
  return { results, hasMore: results.length === 15 }
}