// lib/connectors/sodica.ts
import fetch from "node-fetch"
import * as cheerio from "cheerio"
import { SupplierResult } from "../types"

export async function fetchSodica(query: string): Promise<SupplierResult[]> {
  const url = `https://www.sodica.fr/fr/search?SearchTerm=${encodeURIComponent(query)}`
  const res = await fetch(url)
  const html = await res.text()
  const $ = cheerio.load(html)

  const results: SupplierResult[] = []

  $(".product-list .product").each((i, el) => {
    const title = $(el).find(".product-name").text().trim()
    const link  = $(el).find(".product-name a").attr("href") || ""
    const ref   = $(el).find(".product-ref").text().trim()

    results.push({ supplier: "Sodica", title, reference: ref || title, link })
  })

  return results
}
