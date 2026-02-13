import type { NextApiRequest, NextApiResponse } from 'next'
import * as cheerio from 'cheerio'

type SupplierResult = {
  supplier: string
  title: string | null
  description: string | null
  reference: string | null
  image: string | null
  link: string
  fallbackImage: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const q = (req.query.q as string)?.trim()
  if (!q) return res.status(400).json({ error: 'Query manquante' })

  const results: SupplierResult[] = []

  /* =====================
     🔹 SODIMAS (GOOGLE-LIKE)
     ===================== */
  try {
    const searchUrl = `https://my.sodimas.com/fr/recherche?searchstring=${encodeURIComponent(q)}`
    const searchHtml = await fetch(searchUrl).then(r => r.text())
    const $search = cheerio.load(searchHtml)

    const productPath =
      $search('a[href*="/fr/produit/"]').first().attr('href') || null

    if (productPath) {
      const productUrl = productPath.startsWith('http')
        ? productPath
        : `https://my.sodimas.com${productPath}`

      const productHtml = await fetch(productUrl).then(r => r.text())
      const $ = cheerio.load(productHtml)

      const title =
        $('h1').first().text().trim() ||
        $('meta[property="og:title"]').attr('content') ||
        null

      const image =
        $('meta[property="og:image"]').attr('content') ||
        $('.product-image img').attr('src') ||
        null

      const reference =
        $('[class*="reference"]').text().trim() ||
        $('span:contains("Référence")').next().text().trim() ||
        null

      results.push({
        supplier: 'Sodimas',
        title,
        description: title,
        reference: reference || null,
        image,
        fallbackImage: 'https://my.sodimas.com/home/assets/img/com/logo.png',
        link: productUrl,
      })
    } else {
      results.push({
        supplier: 'Sodimas',
        title: null,
        description: null,
        reference: null,
        image: null,
        fallbackImage: 'https://my.sodimas.com/home/assets/img/com/logo.png',
        link: searchUrl,
      })
    }
  } catch {
    results.push({
      supplier: 'Sodimas',
      title: null,
      description: null,
      reference: null,
      image: null,
      fallbackImage: 'https://my.sodimas.com/home/assets/img/com/logo.png',
      link: `https://my.sodimas.com/fr/recherche?searchstring=${encodeURIComponent(q)}`,
    })
  }

  /* =====================
     🔹 ELVACENTER (inchangé)
     ===================== */
  results.push({
    supplier: 'Elvacenter',
    title: null,
    description: null,
    reference: null,
    image: null,
    fallbackImage:
      'https://shop.elvacenter.com/wp-content/uploads/sites/5/2022/08/beelmerk-elvacenter.svg',
    link: `https://shop.elvacenter.com/#/dfclassic/query=${encodeURIComponent(q)}`,
  })

  return res.status(200).json(results)
}
