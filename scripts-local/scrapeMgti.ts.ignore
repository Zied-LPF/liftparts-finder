import * as cheerio from "cheerio"

export async function scrapeMgti(query: string) {
  const url = `https://www.mgti.fr/PBSearch.asp?ActionID=1&CCode=2&ShowSMImg=1&SearchText=${encodeURIComponent(query)}`
  const res = await fetch(url)
  const html = await res.text()

  const $ = cheerio.load(html)
  const results: any[] = []

  $("table tr").each((i, el) => {
    const title = $(el).find("a").text().trim()
    const link = $(el).find("a").attr("href")

    if (title && link) {
      results.push({
        supplier: "MGTI",
        title,
        reference: "",
        brand: "",
        price: null,
        availability: "",
        url: `https://www.mgti.fr/${link}`,
        image: ""
      })
    }
  })

  return results
}
