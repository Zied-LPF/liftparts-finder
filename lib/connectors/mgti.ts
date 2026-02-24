import * as cheerio from "cheerio"

export interface SupplierResult {
  supplier: string
  ref: string
  label: string
  url: string
  image: string
  stock?: string
}

export async function scrapeMgti(searchText: string): Promise<SupplierResult[]> {
  const url = `https://www.mgti.fr/PBSearch.asp?ActionID=1&CCode=2&SearchPageIdx=1&SCShowPriceZero=1&SearchExtra=&SearchText=${encodeURIComponent(searchText)}&SearchMode=1`

  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115 Safari/537.36",
      "Accept":
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8"
    }
  })

  const html = await res.text()
  const $ = cheerio.load(html)

  const results: SupplierResult[] = []

  $("a.oxcell").each((_, el) => {
    const ref =
      $(el).find(".c-cs-product-display__cell-inner").text().trim() || ""

    const label = $(el).find(".PBItemName").text().trim()

    const href = $(el).attr("href") || ""
    const fullUrl = href.startsWith("http")
      ? href
      : `https://www.mgti.fr/${href.replace(/^\//, "")}`

    const imgSrc = $(el).find("img.smallImg").attr("src") || ""
    const image = imgSrc
      ? `https://www.mgti.fr/${imgSrc.replace(/^\//, "")}`
      : ""

    const stock = $(el)
      .find(".PBMsgInStock, .PBMsgStockLvl")
      .text()
      .trim()

    if (label) {
      results.push({
        supplier: "MGTI",
        ref,
        label,
        url: fullUrl,
        image,
        stock
      })
    }
  })

  return results
}