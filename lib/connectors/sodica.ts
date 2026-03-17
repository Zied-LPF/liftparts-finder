import type { SupplierResult } from "../types"
import { chromium } from "playwright"

export async function searchSodica(
  query: string,
  page: number = 1
): Promise<{ results: SupplierResult[]; hasMore: boolean }> {

  const results: SupplierResult[] = []
  let browser: any = null

  try {

    browser = await chromium.launch({
      headless: true // ✅ compatible Vercel direct
    })

    const pageBrowser = await browser.newPage()
    await pageBrowser.setViewportSize({ width: 1366, height: 768 })

    console.log("➡️ Ouverture Sodica")

    await pageBrowser.goto("https://sodica.fr", {
      waitUntil: "domcontentloaded"
    })

    // accepter cookies si présent
    try {
      await pageBrowser.click('#onetrust-accept-btn-handler', { timeout: 5000 })
      console.log("Cookies OK")
    } catch {}

    // petite pause
    await pageBrowser.waitForTimeout(1000)

    // focus champ recherche
    await pageBrowser.click('input[name="SearchTerm"]')
    await pageBrowser.fill('input[name="SearchTerm"]', query)

    await pageBrowser.waitForTimeout(500)
    await pageBrowser.keyboard.press("Enter")

    console.log("🔍 Recherche lancée")

    // attendre produits
    await pageBrowser.waitForSelector(".product-grid-item", { timeout: 20000 })
    console.log("✅ Produits chargés")

    const hasProductsInHTML = await pageBrowser.content().then(c =>
 	 c.includes("product-grid-item")
    )
    console.log("HTML contient produits:", hasProductsInHTML)

    // =========================
    // 🔽 PAGINATION
    // =========================
    for (let i = 1; i < page; i++) {
      console.log(`➡️ Passage à la page ${i + 1}`)

      const nextBtn = await pageBrowser.$('a:has(.ph-caret-right)')
      if (!nextBtn) {
        console.log("❌ Pas de page suivante")
        break
      }

      await Promise.all([
        nextBtn.click(),
        pageBrowser.waitForLoadState("domcontentloaded")
      ])

      await pageBrowser.waitForTimeout(800)
    }
    // =========================

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
          title: item.designation
        })
      }
    })

    const hasMore = (await pageBrowser.$('a:has(.ph-caret-right)')) !== null

    return { results, hasMore }

  } catch (err) {
    console.error("Erreur searchSodica:", err)
    return { results: [], hasMore: false }
  } finally {
    if (browser) await browser.close()
  }

}