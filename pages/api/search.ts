import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'

type SupplierResult = {
  name: string
  searchUrl: string
  score: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SupplierResult[]>
) {
  const q = (req.query.q as string)?.trim()

  if (!q) {
    return res.status(200).json([])
  }

  const { data: suppliers, error } = await supabase
    .from('suppliers')
    .select('name, base_url, priority')
    .eq('active', true)

  if (error || !suppliers) {
    console.error(error)
    return res.status(500).json([])
  }

  const results: SupplierResult[] = suppliers.map((s) => ({
    name: s.name,
    searchUrl: `${s.base_url}${encodeURIComponent(q)}`,
    score: s.priority ?? 0,
  }))

  res.status(200).json(results)
}
