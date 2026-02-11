import type { NextApiRequest, NextApiResponse } from 'next'
import { SUPPLIERS } from '../../lib/suppliers'
import { supabase } from '../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { q } = req.query

  if (!q || typeof q !== 'string') {
    return res.status(200).json({ parts: [] })
  }

  const { data, error } = await supabase
    .from('parts')
    .select('*')
    .ilike('name', `%${q}%`)

  if (error) {
    console.error(error)
    return res.status(500).json({ error: 'Database error' })
  }

  const partsWithSuppliers = (data || []).map((part) => {
    const suppliers = SUPPLIERS.filter(s => s.active)
    return {
      ...part,
      suppliers
    }
  })

  return res.status(200).json({ parts: partsWithSuppliers })
}
