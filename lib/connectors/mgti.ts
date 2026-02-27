// lib/connectors/mgti.ts

import * as cheerio from "cheerio"

export interface SupplierResult {
  supplier: string
  ref: string
  label: string
  url: string
  image: string
  stock?: string
}

export async function scrapeMgti(
  searchText: string
): Promise<SupplierResult[]> {
  try {
    const url = `https://www.mgti.fr/PBSearch.asp?ActionID=1&CCode=2&ShowSMImg=1&SearchText=${encodeURIComponent(
      searchText
    )}&SearchMode=1`

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145 Safari/537.36",
        "Accept-Language": "fr-FR,fr;q=0.9"
      }
    })

    const html = await response.text()

    const $ = cheerio.load(html)
    const results: SupplierResult[] = []

    $("a.oxcell").each((_, el) => {
      const label = $(el).find(".PBItemName").text().trim()

      const ref =
        $(el).find(".PBItemDesc").text().trim() ||
        $(el).find(".PBItemCode").text().trim()

      const href = $(el).attr("href") || ""
      const fullUrl = href.startsWith("http")
        ? href
        : `https://www.mgti.fr/${href.replace(/^\//, "")}`

      const imgSrc = $(el).find("img").attr("src") || ""
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

    console.log("MGTI HTTP COUNT:", results.length)

    return results
  } catch (err) {
    console.error("MGTI HTTP failed:", err)
    return []
  }
}