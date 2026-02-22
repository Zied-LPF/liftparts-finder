import { chromium } from "playwright"

export interface SupplierResult {
  supplier: string
  ref: string
  label: string
  url: string
  image: string
  stock?: string
}

export async function scrapeMgti(searchText: string): Promise<SupplierResult[]> {
  const browser = await chromium.launch({
    headless: true
  })

  const page = await browser.newPage()

  const url = `https://www.mgti.fr/PBSearch.asp?ActionID=1&CCode=2&ShowSMImg=1&SearchText=${encodeURIComponent(searchText)}`

  await page.goto(url, { waitUntil: "domcontentloaded" })

  try {
    await page.waitForSelector("a.oxcell", { timeout: 15000 })
  } catch {
    await browser.close()
    return []
  }

  const results = await page.evaluate(() => {
    const items: any[] = []
    const products = document.querySelectorAll("a.oxcell")

    products.forEach(product => {
      // 🔹 Référence (parfois dans petit texte en haut)
      const ref =
        product.querySelector(".PBRef")?.textContent?.trim() ||
        product.querySelector(".c-cs-product-display__cell-inner")
          ?.textContent?.trim() ||
        ""

      // 🔹 Désignation
      const label =
        product.querySelector(".PBItemName")
          ?.textContent?.trim() || ""

      // 🔹 URL
      const href = product.getAttribute("href") || ""
      const fullUrl = href.startsWith("http")
        ? href
        : `https://www.mgti.fr/${href.replace(/^\//, "")}`

      // 🔹 Image (src OU data-src)
      const imgElement = product.querySelector("img")
      let imgSrc =
        imgElement?.getAttribute("src") ||
        imgElement?.getAttribute("data-src") ||
        ""

      let image = ""
      if (imgSrc && imgSrc !== "/" && imgSrc.trim() !== "") {
        image = imgSrc.startsWith("http")
          ? imgSrc
          : `https://www.mgti.fr/${imgSrc.replace(/^\//, "")}`
      }

      // 🔹 Stock (souvent dans un span spécifique)
      const stock =
        product.querySelector(".PBStock")?.textContent?.trim() ||
        product.querySelector(".availability")?.textContent?.trim() ||
        ""

      if (label) {
        items.push({
          supplier: "MGTI",
          ref,
          label,
          url: fullUrl,
          image,
          stock
        })
      }
    })

    return items
  })

  await browser.close()

  return results
}