import axios from 'axios'
import * as cheerio from 'cheerio'

export async function searchMySodimas(query: string) {
  const url = `https://my.sodimas.com/fr/search?controller=search&s=${encodeURIComponent(query)}`

  const { data } = await axios.get(url, {
    headers: {
      'User-Agent': 'LiftPartsFinderBot/1.0'
    }
  })

  const $ = cheerio.load(data)
  const results: any[] = []

  $('.product-miniature').each((_, el) => {
    const name = $(el).find('.product-title').text().trim()
    const link = $(el).find('a').attr('href')
    const reference = $(el).find('.product-reference').text().trim()

    if (name) {
      results.push({
        supplier: 'MySodimas',
        name,
        reference: reference || null,
        url: link || null,
      })
    }
  })

  return results
}
