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
     🔹 SODIMAS (SAFE)
     ===================== */
  results.push({
    supplier: 'Sodimas',
    title: null,
    description: null,
    reference: q,
    image: null,
    fallbackImage: 'https://my.sodimas.com/home/assets/img/com/logo.png',
    link: `https://my.sodimas.com/fr/recherche?searchstring=${encodeURIComponent(q)}`,
  })

  /* =====================
     🔹 ELVACENTER
     ===================== */
  try {
    const searchUrl = `https://shop.elvacenter.com/#/dfclassic/query=${encodeURIComponent(q)}`
    const html = await fetch(searchUrl).then(r => r.text())
    const $ = cheerio.load(html)

    let match: SupplierResult | null = null

    $('.product-grid-item').each((_, el) => {
      if (match) return

      const title = $(el).find('.product-title').text().trim()
      const link = $(el).find('a').attr('href') || ''
      const image =
        $(el).find('img').attr('src') ||
        $(el).find('img').attr('data-src') ||
        null

      if (
        title.toLowerCase().includes(q.toLowerCase()) ||
        link.toLowerCase().includes(q.toLowerCase())
      ) {
        match = {
          supplier: 'Elvacenter',
          title,
          description: title, // Elvacenter = titre descriptif
          reference: q,
          image,
          fallbackImage:
            'https://shop.elvacenter.com/wp-content/uploads/sites/5/2022/08/beelmerk-elvacenter.svg',
          link: link.startsWith('http')
            ? link
            : `https://shop.elvacenter.com${link}`,
        }
      }
    })

    results.push(
      match ?? {
        supplier: 'Elvacenter',
        title: null,
        description: null,
        reference: q,
        image: null,
        fallbackImage:
          'https://shop.elvacenter.com/wp-content/uploads/sites/5/2022/08/beelmerk-elvacenter.svg',
        link: searchUrl,
      }
    )
  } catch {
    results.push({
      supplier: 'Elvacenter',
      title: null,
      description: null,
      reference: q,
      image: null,
      fallbackImage:
        'https://shop.elvacenter.com/wp-content/uploads/sites/5/2022/08/beelmerk-elvacenter.svg',
      link: `https://shop.elvacenter.com/#/dfclassic/query=${encodeURIComponent(q)}`,
    })
  }

  return res.status(200).json(results)
}
