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

  // 🔍 Recherche SUR PLUSIEURS CHAMPS
  const { data, error } = await supabase
    .from('parts')
    .select('*')
    .or(
      `reference.ilike.%${q}%,name.ilike.%${q}%`
    )

  if (error) {
    console.error('Supabase error:', error)
    return res.status(500).json({ error: 'Database error' })
  }

  const partsWithSuppliers = (data || []).map((part) => ({
    ...part,
    suppliers: SUPPLIERS.filter(s => s.active)
  }))

  return res.status(200).json({ parts: partsWithSuppliers })
}
