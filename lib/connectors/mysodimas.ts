import fetch from "node-fetch"
import * as cheerio from "cheerio"
import { SupplierResult } from "../types"

export async function fetchMySodimas(query: string): Promise<SupplierResult[]> {
  const url = `https://my.sodimas.com/fr/recherche?searchstring=${encodeURIComponent(query)}`
  const html = await (await fetch(url)).text()
  const $ = cheerio.load(html)
  const results: SupplierResult[] = []

  $(".listing .product-card").each((i, el) => {
    const title = $(el).find(".product-title").text().trim()
    const link  = $(el).find("a").attr("href") || ""
    const ref   = $(el).find(".product-ref").text().trim()
    results.push({ supplier: "MySodimas", title, reference: ref || title, link })
  })

  return results
}
