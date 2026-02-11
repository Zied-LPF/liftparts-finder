import { Supplier } from './suppliers'

export type Part = {
  id: string
  name?: string
  reference?: string
  brand?: string
  supplier?: Supplier | null
}

export function computeScore(
  part: Part,
  query: string,
  favoriteSupplier?: string
): number {
  const q = query.toLowerCase().trim()
  let score = 0

  // 🔑 Référence exacte
  if (part.reference?.toLowerCase() === q) {
    score += 100
  }

  // 🔍 Référence partielle
  if (part.reference?.toLowerCase().includes(q)) {
    score += 50
  }

  // 🧾 Nom contient le mot
  if (part.name?.toLowerCase().includes(q)) {
    score += 20
  }

  // 🏷️ Marque
  if (part.brand?.toLowerCase().includes(q)) {
    score += 15
  }

  // 🏭 Priorité fournisseur
  if (part.supplier?.priority) {
    score += part.supplier.priority
  }

  // ⭐ Fournisseur favori (prévu V1.1)
  if (
    favoriteSupplier &&
    part.supplier?.name.toLowerCase() === favoriteSupplier.toLowerCase()
  ) {
    score += 30
  }

  return score
}
