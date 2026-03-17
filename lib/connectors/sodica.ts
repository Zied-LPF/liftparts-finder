import type { SupplierResult } from "../types"
import puppeteer from "puppeteer-extra"
import StealthPlugin from "puppeteer-extra-plugin-stealth"

puppeteer.use(StealthPlugin())

export async function searchSodica(
  query: string,
  page: number = 1
): Promise<{ results: SupplierResult[]; hasMore: boolean }> {

  const results: SupplierResult[] = []
  let browser: any = null

  try {

    browser = await puppeteer.launch({
      headless: true, // mode headless pour Vercel / rapide
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    })

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
    await new Promise(resolve => setTimeout(resolve, 1000))

    // focus champ recherche
    await pageBrowser.click('input[name="SearchTerm"]')
    await pageBrowser.type('input[name="SearchTerm"]', query, { delay: 80 })

    await new Promise(resolve => setTimeout(resolve, 500))

    await pageBrowser.keyboard.press("Enter")
    console.log("🔍 Recherche lancée")

    // attendre produits (page 1)
    await pageBrowser.waitForSelector(".product-grid-item", { timeout: 20000 })
    console.log("✅ Produits chargés")

    // =========================
    // 🔽 PAGINATION AJOUTÉE
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
        pageBrowser.waitForNavigation({ waitUntil: "networkidle2", timeout: 20000 })
      ])

      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    // =========================

    const data: {
      designation: string
      reference: string
      image: string
      link: string
    }[] = await pageBrowser.evaluate(() => {
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

    data.forEach(item => {
      if (item.designation && item.reference) {
        results.push({
          supplier: "Sodica",
          designation: item.designation,
          reference: item.reference,
          image: item.image,
          stock: "",
          link: item.link,
          title: item.designation // ✅ requis par SupplierResult
        })
      }
    })

    // =========================
    // 🔽 DETECTION hasMore
    // =========================
    const hasMore = (await pageBrowser.$('a:has(.ph-caret-right)')) !== null
    // =========================

    return { results, hasMore }

  } catch (err) {
    console.error("Erreur searchSodica:", err)
    return { results: [], hasMore: false }
  } finally {
    if (browser) await browser.close()
  }

}