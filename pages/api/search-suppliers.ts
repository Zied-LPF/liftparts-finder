import type { NextApiRequest, NextApiResponse } from 'next'
import { suppliers } from '../../lib/suppliers'

type SupplierResult = {
  supplier: string
  title: string
  image?: string
  link: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = (req.query.q as string)?.trim()

  if (!query) {
    return res.status(400).json({ error: 'Query manquante' })
  }

  const results: SupplierResult[] = []

  const activeSuppliers = suppliers.filter(
    s => s.name === 'Sodimas' || s.name === 'Elvacenter'
  )

  for (const supplier of activeSuppliers) {
    try {
      const searchUrl = `${supplier.baseUrl}${encodeURIComponent(query)}`

      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'LiftPartsFinder/2.0',
          'Accept': 'text/html',
        },
      })

      if (!response.ok) {
        console.warn(`HTTP ${response.status} chez ${supplier.name}`)
        continue
      }

      const html = await response.text()

      let title = query
      let image: string | undefined

      // 🟢 SODIMAS
      if (supplier.name === 'Sodimas') {
        const imgMatch = html.match(/<img[^>]+src="([^"]+)"/i)
        if (imgMatch) {
          image = imgMatch[1].startsWith('http')
            ? imgMatch[1]
            : `https://my.sodimas.com${imgMatch[1]}`
        }

        const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/i)
        if (titleMatch) {
          title = titleMatch[1].replace(/<[^>]+>/g, '').trim()
        }
      }

      // 🟢 ELVACENTER
      if (supplier.name === 'Elvacenter') {
        const imgMatch = html.match(/<img[^>]+src="([^"]+)"/i)
        if (imgMatch) {
          image = imgMatch[1].startsWith('http')
            ? imgMatch[1]
            : `https://shop.elvacenter.com${imgMatch[1]}`
        }
      }

      results.push({
        supplier: supplier.name,
        title,
        image,
        link: searchUrl,
      })
    } catch (err) {
      console.error(`Erreur fournisseur ${supplier.name}`, err)
    }
  }

  return res.status(200).json(results)
}
