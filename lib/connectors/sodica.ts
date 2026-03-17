import type { SupplierResult } from "../types"
import puppeteer from "puppeteer-extra"
import StealthPlugin from "puppeteer-extra-plugin-stealth"

puppeteer.use(StealthPlugin())

// import conditionnel de chrome-aws-lambda pour Vercel / serverless
const isProd = process.env.VERCEL === "1"
let chromium: any = null
if (isProd) {
  chromium = require("chrome-aws-lambda")
}

export async function searchSodica(
  query: string,
  page: number = 1
): Promise<{ results: SupplierResult[]; hasMore: boolean }> {

  const results: SupplierResult[] = []
  let browser: any = null

  try {

    browser = await (isProd
      ? puppeteer.launch({
          args: chromium.args,
          executablePath: await chromium.executablePath,
          headless: chromium.headless,
        })
      : puppeteer.launch({
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"]
        })
    )

    const pageBrowser = await browser.newPage()
    await pageBrowser.setViewport({ width: 1366, height: 768 })

    console.log("➡️ Ouverture Sodica")

    await pageBrowser.goto("https://sodica.fr", {
      waitUntil: "networkidle2"
    })

    // accepter cookies si présent
    try {
      await pageBrowser.click('#onetrust-accept-btn-handler', { timeout: 5000 })
      console.log("Cookies OK")
    } catch {}

    // pause humaine
    await new Promise(resolve => setTimeout(resolve, 2000))

    // focus champ recherche
    await pageBrowser.click('input[name="SearchTerm"]')
    await pageBrowser.type('input[name="SearchTerm"]', query, { delay: 120 })

    await new Promise(resolve => setTimeout(resolve, 1000))

    await pageBrowser.keyboard.press("Enter")
    console.log("🔍 Recherche lancée")

    // attendre produits (page 1)
    await pageBrowser.waitForSelector(".product-grid-item", { timeout: 30000 })
    console.log("✅ Produits chargés")

    // pagination
    if (page > 1) {
      for (let i = 1; i < page; i++) {
        console.log(`➡️ Passage à la page ${i + 1}`)

        const nextBtn = await pageBrowser.$('a:has(.ph-caret-right)')
        if (!nextBtn) break

        await Promise.all([
          nextBtn.click(),
          pageBrowser.waitForNavigation({ waitUntil: "networkidle2", timeout: 30000 })
        ])

        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    const data = await pageBrowser.evaluate(() => {
      return Array.from(document.querySelectorAll(".product-grid-item")).map(el => {
        const designation =
          el.querySelector(".product-title")?.textContent?.trim() || ""
        const reference =
          el.querySelector(".product-number-label")?.nextElementSibling?.textContent?.trim() || ""
        let image = (el.querySelector("img") as HTMLImageElement)?.getAttribute("src") || ""
        if (image && !image.startsWith("http")) image = "https://sodica.fr" + image
        let link = (el.querySelector(".product-title") as HTMLAnchorElement)?.getAttribute("href") || ""
        if (link && !link.startsWith("http")) link = "https://sodica.fr" + link
        return { designation, reference, image, link }
      })
    })

    data.forEach((item: { designation: string; reference: string; image: string; link: string }) => {
      if (item.designation && item.reference) {
        results.push({
          supplier: "Sodica",
          designation: item.designation,
          reference: item.reference,
          image: item.image,
          stock: "",
          link: item.link,
          title: item.designation // ajout obligatoire TS
        })
      }
    })

    const hasMore = await pageBrowser.$('a:has(.ph-caret-right)') !== null

    return { results, hasMore }

  } catch (err) {
    console.error("Erreur searchSodica:", err)
    return { results: [], hasMore: false }
  } finally {
    if (browser) await browser.close()
  }

}