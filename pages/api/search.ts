import type { NextApiRequest, NextApiResponse } from 'next'
import { SUPPLIERS, Supplier } from '../../lib/suppliers'
import { supabase } from '../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const query = (req.query.q as string)?.trim()

  if (!query) {
    return res.status(200).json([])
  }

  const { data, error } = await supabase
    .from('parts')
    .select('*')
    .or(`name.ilike.%${query}%,reference.ilike.%${query}%`)

  if (error) {
    console.error(error)
    return res.status(500).json({ error: error.message })
  }

  const results = (data || []).map((part) => {
    const supplier: Supplier | undefined = SUPPLIERS.find(
      (s) =>
        s.name.toLowerCase() ===
        (part.brand || '').toLowerCase()
    )

    return {
      ...part,
      supplier,
      supplierPriority: supplier ? supplier.priority : 0,
    }
  })

  return res.status(200).json(results)
}
