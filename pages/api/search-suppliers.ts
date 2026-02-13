import type { NextApiRequest, NextApiResponse } from 'next'
import * as cheerio from 'cheerio'

type SupplierResult = {
  supplier: string
  title: string | null
  image: string | null
  link: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const q = (req.query.q as string)?.trim()

  if (!q) {
    return res.status(400).json({ error: 'Query manquante' })
  }

  const results: SupplierResult[] = []

  /* ===========================
     🔹 SODIMAS (MODE PRO)
     =========================== */
  results.push({
    supplier: 'Sodimas',
    title: null,
    image: 'https://my.sodimas.com/home/assets/img/com/logo.png',
    link: `https://my.sodimas.com/fr/recherche?searchstring=${encodeURIComponent(q)}`,
  })

  /* ===========================
     🔹 ELVACENTER (MATCH EXACT)
     =========================== */
  try {
    const searchUrl = `https://shop.elvacenter.com/#/dfclassic/query=${encodeURIComponent(q)}`
    const html = await fetch(searchUrl).then(r => r.text())
    const $ = cheerio.load(html)

    let matchedProduct: SupplierResult | null = null

    $('.product-grid-item').each((_, el) => {
      if (matchedProduct) return

      const title = $(el).find('.product-title').text().trim()
      const link = $(el).find('a').attr('href') || ''
      const image =
        $(el).find('img').attr('src') ||
        $(el).find('img').attr('data-src') ||
        null

      const normalizedQ = q.toLowerCase()

      if (
        title.toLowerCase().includes(normalizedQ) ||
        link.toLowerCase().includes(normalizedQ)
      ) {
        matchedProduct = {
          supplier: 'Elvacenter',
          title,
          image,
          link: link.startsWith('http')
            ? link
            : `https://shop.elvacenter.com${link}`,
        }
      }
    })

    if (matchedProduct) {
      results.push(matchedProduct)
    } else {
      results.push({
        supplier: 'Elvacenter',
        title: null,
        image: 'https://shop.elvacenter.com/wp-content/uploads/sites/5/2022/08/beelmerk-elvacenter.svg',
        link: searchUrl,
      })
    }
  } catch (err) {
    results.push({
      supplier: 'Elvacenter',
      title: null,
      image: 'https://shop.elvacenter.com/wp-content/uploads/sites/5/2022/08/beelmerk-elvacenter.svg',
      link: `https://shop.elvacenter.com/#/dfclassic/query=${encodeURIComponent(q)}`,
    })
  }

  return res.status(200).json(results)
}
