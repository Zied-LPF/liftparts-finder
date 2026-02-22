// lib/types.ts

export type SupplierResult = {
  supplier: string
  title: string
  reference?: string
  link: string
  price?: number       // 🔹 number | undefined
  brand?: string
  source?: string
  score?: number
  image?: string      // 🔹 ajouté pour ResultCard
  stock?: string      // 🔹 ajouté pour ResultCard
}

export type Part = {
  id: string
  name: string
  reference: string
  brand: string
  category: string | null
  notes: string | null
  favorite_supplier_id?: string
  created_at?: string
  is_favorite?: boolean
  images?: string
  link: string
  supplier: string
  title: string
  price: number
}