import type { SupplierResult } from "../types"

let puppeteer: typeof import("puppeteer") | typeof import("puppeteer-core")
let executablePath: string | undefined
let args: string[] | undefined
let defaultViewport: any

export async function searchKone(
  query: string,
  page: number = 1
): Promise<{ results: SupplierResult[]; hasMore: boolean }> {

 if (process.env.VERCEL) {
  const puppeteer = await import("puppeteer-core")
  const chromium = await import("@sparticuz/chromium")

  // ✅ FIX TYPE TS (clé)
  const chromiumAny = chromium as any

  executablePath = await chromiumAny.executablePath()
  args = chromiumAny.args
  defaultViewport = chromiumAny.defaultViewport
} else {
  puppeteer = await import("puppeteer")

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
    const pageBrowser = await browser.newPage()

    await pageBrowser.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
    )

    // ================= NAVIGATION =================
    await pageBrowser.goto("https://parts.kone.com/", {
      waitUntil: "networkidle2",
    })

    // ================= SEARCH =================
    await pageBrowser.type("#mstxtSearchSparePart", query)

    await Promise.all([
      pageBrowser.click("#msbtnSearch"),
      pageBrowser.waitForNavigation({ waitUntil: "networkidle2" })
    ])

    // ================= PAGINATION =================
    if (page > 1) {
      for (let i = 1; i < page; i++) {
        const nextBtn = await pageBrowser.$(".qa-ProductSelection-Next-Link")
        if (!nextBtn) break

        await Promise.all([
          nextBtn.click(),
          pageBrowser.waitForNavigation({ waitUntil: "networkidle2" })
        ])
      }
    }

    // ================= PARSING =================
    const { items, hasMore } = await pageBrowser.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('[id$="$$"]'))

      const items = elements
        .map((el) => {
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
        .filter(item => item.reference)

      const hasMore = !!document.querySelector(".qa-ProductSelection-Next-Link")

      return { items, hasMore }
    })

    return {
      results: items,
      hasMore
    }

  } catch (err) {
    console.error("KONE Puppeteer error:", err)
    return { results: [], hasMore: false }
  } finally {
    await browser.close()
  }
}