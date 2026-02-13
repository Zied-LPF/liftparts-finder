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
     🔹 SODIMAS (REAL SCRAPING)
     ===================== */
  try {
    const searchUrl = `https://my.sodimas.com/fr/recherche?searchstring=${encodeURIComponent(q)}`
    const html = await fetch(searchUrl).then(r => r.text())
    const $ = cheerio.load(html)

    let found: SupplierResult | null = null

    $('.product-item').each((_, el) => {
      if (found) return

      const title = $(el).find('.product-item-link').text().trim()
      const link = $(el).find('.product-item-link').attr('href') || ''
      const reference = $(el).find('.sku').text().trim() || null
      const image =
        $(el).find('img').attr('src') ||
        $(el).find('img').attr('data-src') ||
        null

      if (
        title.toLowerCase().includes(q.toLowerCase()) ||
        reference?.toLowerCase().includes(q.toLowerCase())
      ) {
        found = {
          supplier: 'Sodimas',
          title,
          description: title,
          reference,
          image: image?.startsWith('http')
            ? image
            : image
            ? `https://my.sodimas.com${image}`
            : null,
          fallbackImage:
            'https://my.sodimas.com/home/assets/img/com/logo.png',
          link: link.startsWith('http')
            ? link
            : `https://my.sodimas.com${link}`,
        }
      }
    })

    results.push(
      found ?? {
        supplier: 'Sodimas',
        title: null,
        description: null,
        reference: null,
        image: null,
        fallbackImage:
          'https://my.sodimas.com/home/assets/img/com/logo.png',
        link: searchUrl,
      }
    )
  } catch {
    results.push({
      supplier: 'Sodimas',
      title: null,
      description: null,
      reference: null,
      image: null,
      fallbackImage:
        'https://my.sodimas.com/home/assets/img/com/logo.png',
      link: `https://my.sodimas.com/fr/recherche?searchstring=${encodeURIComponent(q)}`,
    })
  }

  /* =====================
     🔹 ELVACENTER (SAFE MODE)
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
