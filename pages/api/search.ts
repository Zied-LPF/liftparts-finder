// pages/api/search.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { suppliers } from '../../lib/suppliers'
import type { SupplierResult } from '../../lib/types'

// 🔹 Rate limit simple en mémoire
const rateLimit = new Map<string, { count: number; time: number }>()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SupplierResult[] | { error: string }>
) {
  res.setHeader('Cache-Control', 'no-store')

  // 🔹 Protection anti-bot renforcée
  const userAgent = (req.headers['user-agent'] || '').toLowerCase()
  const referer = (req.headers['referer'] || '').toLowerCase()
  const secFetchSite = req.headers['sec-fetch-site']

  if (
    !userAgent ||
    userAgent.includes('curl') ||
    userAgent.includes('wget') ||
    userAgent.includes('python') ||
    userAgent.includes('scrapy') ||
    userAgent.includes('postman')
  ) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  if (!referer || !referer.includes('liftparts')) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  if (!secFetchSite) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  // 🔹 Rate limit par IP
  const ip =
    (req.headers['x-forwarded-for'] as string) ||
    req.socket.remoteAddress ||
    'unknown'
  const now = Date.now()
  const limit = rateLimit.get(ip)

  if (!limit) {
    rateLimit.set(ip, { count: 1, time: now })
  } else {
    if (now - limit.time < 60000) {
      limit.count++
      if (limit.count > 30) {
        return res.status(429).json({ error: 'Too many requests' })
      }
    } else {
      rateLimit.set(ip, { count: 1, time: now })
    }
  }

  // 🔹 Validation + limite taille recherche
  const rawQuery = req.query.q
  const query = typeof rawQuery === 'string' ? rawQuery.slice(0, 80) : ''

  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter q' })
  }

  console.log('API Meta Search start for query:', query)

  try {
    // 🔹 Petit délai anti-scraping
    await new Promise(r => setTimeout(r, 200))

    // 🔹 Lancer tous les fournisseurs en parallèle
    const resultsPerSupplier = await Promise.allSettled(
      suppliers.map(s => s.search(query))
    )

    // 🔹 Fusionner tous les résultats, ignorer les fournisseurs qui échouent
    const combined: SupplierResult[] = resultsPerSupplier
      .map(r => (r.status === 'fulfilled' ? r.value : []))
      .flat()

    console.log(
      'Supplier counts:',
      resultsPerSupplier.map((r, i) => ({
        supplier: suppliers[i].name,
        status: r.status,
        count: r.status === 'fulfilled' ? r.value.length : 0
      }))
    )

    console.log('TOTAL COMBINED:', combined.length)

    return res.status(200).json(combined)
  } catch (err: any) {
    console.error('API Meta Search error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}