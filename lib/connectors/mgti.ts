// lib/connectors/mgti.ts
import fetch from "node-fetch"
import * as cheerio from "cheerio"
import { SupplierResult } from "../types"

export async function fetchMgti(query: string): Promise<SupplierResult[]> {
  const url = `https://www.mgti.fr/PBSearch.asp?ActionID=1&CCode=2&ShowSMImg=1&SearchText=${encodeURIComponent(query)}`
  const res = await fetch(url)
  const html = await res.text()
  const $ = cheerio.load(html)

  const results: SupplierResult[] = []

  $("table.tbsearchresults tr").each((i, tr) => {
    const link  = $(tr).find("td a").attr("href")
    const title = $(tr).find("td a").text().trim()
    const ref   = $(tr).find("td:nth-child(2)").text().trim()
    if (link) results.push({ supplier: "MGTI", title, reference: ref || title, link })
  })

  return results
}
