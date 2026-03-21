import type { SupplierResult } from "../types"

let puppeteer: typeof import("puppeteer") | typeof import("puppeteer-core")

export async function searchKone(
  query: string,
  page: number = 1
): Promise<{ results: SupplierResult[]; hasMore: boolean }> {
  let browser: any

  try {
    // ================= ENV =================
    if (process.env.VERCEL) {
      puppeteer = await import("puppeteer-core")
      const chromiumModule = await import("@sparticuz/chromium")

      // 🔥 IMPORTANT : accès safe au module
      const chromium: any = chromiumModule.default || chromiumModule

      if (!chromium) {
        throw new Error("Chromium module not loaded")
      }

      let executablePath: string | undefined

      // ✅ CAS 1 : fonction
      if (typeof chromium.executablePath === "function") {
        executablePath = await chromium.executablePath()
      }

      // ✅ CAS 2 : string directe
      if (!executablePath && typeof chromium.executablePath === "string") {
        executablePath = chromium.executablePath
      }

      // ❌ CAS BLOQUANT → on arrête
      if (!executablePath) {
        throw new Error("Chromium executablePath not available")
      }

      browser = await puppeteer.launch({
        args: chromium.args || [],
        defaultViewport: chromium.defaultViewport,
        executablePath,
        headless: true,
      })
    } else {
      puppeteer = await import("puppeteer")

      browser = await puppeteer.launch({
        headless: true,
      })
    }

    const pageBrowser = await browser.newPage()

    // ================= NAVIGATION =================
    await pageBrowser.goto("https://parts.kone.com/", {
      waitUntil: "domcontentloaded",
    })

    await pageBrowser.waitForSelector("#mstxtSearchSparePart", {
      timeout: 10000,
    })

    // ================= SEARCH =================
    await pageBrowser.type("#mstxtSearchSparePart", query)

    await Promise.all([
      pageBrowser.click("#msbtnSearch"),
      pageBrowser.waitForNavigation({ waitUntil: "networkidle2" }),
    ])

    // ================= PAGINATION =================
    if (page > 1) {
      for (let i = 1; i < page; i++) {
        const nextBtn = await pageBrowser.$(".qa-ProductSelection-Next-Link")
        if (!nextBtn) break

        await Promise.all([
          nextBtn.click(),
          pageBrowser.waitForNavigation({ waitUntil: "networkidle2" }),
        ])
      }
    }

    // ================= PARSING =================
    const { items, hasMore } = await pageBrowser.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('[id$="$$"]'))

      const items = elements
        .map((el: any) => {
          const refEl = el.querySelector('[class*="ProductNumber-Link"]')
          const reference = refEl?.textContent?.trim() || ""

          const titleEl = el.querySelector('[class*="Description"]')
          const title = titleEl?.textContent?.trim() || ""

          const imgEl = el.querySelector('img[data-src]')
          let image = imgEl?.getAttribute("data-src") || ""

          if (image && !image.startsWith("http")) {
            image = "https://parts.kone.com" + image
          }

          const link = reference
            ? `https://parts.kone.com/Products/${reference}?searchMode=SpareParts`
            : ""

          return {
            supplier: "KONE",
            reference,
            title,
            image,
            link,
          }
        })
        .filter((item: any) => item.reference)

      const hasMore = !!document.querySelector(
        ".qa-ProductSelection-Next-Link"
      )

      return { items, hasMore }
    })

    return { results: items, hasMore }
  } catch (error) {
    console.error("KONE error:", error)
    return { results: [], hasMore: false }
  } finally {
    if (browser) await browser.close()
  }
}