import type { NextApiRequest, NextApiResponse } from 'next'
import * as cheerio from 'cheerio'

type Result = {
  supplier: string
  title: string
  image?: string
  link: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Result[]>
) {
  const q = String(req.query.q || '').trim()
  if (!q) return res.status(200).json([])

  const results: Result[] = []

  /* =========================
     SODIMAS
  ========================== */
  try {
    const url = `https://my.sodimas.com/fr/recherche?searchstring=${encodeURIComponent(q)}`
    const html = await fetch(url).then(r => r.text())
    const $ = cheerio.load(html)

    const firstLink = $('a[href*="/produit"]').first()
    const link = firstLink.attr('href')

    if (link) {
      const productPage = await fetch(`https://my.sodimas.com${link}`).then(r => r.text())
      const $$ = cheerio.load(productPage)

      const title =
        $$('h1').first().text().trim() || q

      let image =
        $$('img[src*="produit"]').attr('src') ||
        $$('img[src*="catalog"]').attr('src')

      if (image && image.startsWith('/')) {
        image = `https://my.sodimas.com${image}`
      }

      results.push({
        supplier: 'Sodimas',
        title,
        image,
        link: `https://my.sodimas.com${link}`,
      })
    }
  } catch (e) {
    console.error('Sodimas error', e)
  }

  /* =========================
     ELVACENTER
  ========================== */
  try {
    const url = `https://shop.elvacenter.com/#/dfclassic/query=${encodeURIComponent(q)}`
    const html = await fetch(url).then(r => r.text())
    const $ = cheerio.load(html)

    const product = $('.product, li.product').first()

    if (product.length) {
      const title =
        product.find('h2, h3, .woocommerce-loop-product__title').first().text().trim() || q

      let image =
        product.find('img.wp-post-image').attr('src') ||
        product.find('img').first().attr('src')

      const link =
        product.find('a').first().attr('href') ||
        url

      results.push({
        supplier: 'Elvacenter',
        title,
        image,
        link,
      })
    }
  } catch (e) {
    console.error('Elvacenter error', e)
  }

  return res.status(200).json(results)
}
