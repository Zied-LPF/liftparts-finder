import { Supplier } from './suppliers'

type PartWithSupplier = {
  name?: string
  reference?: string
  brand?: string
  supplier?: Supplier | null
}

export function computeScore(
  part: PartWithSupplier,
  query: string,
  favoriteSupplier?: string
): number {
  const q = query.toLowerCase()
  let score = 0

  // 🔹 Référence = ultra prioritaire
  if (part.reference?.toLowerCase().includes(q)) {
    score += 100
  }

  // 🔹 Nom
  if (part.name?.toLowerCase().includes(q)) {
    score += 50
  }

  // 🔹 Marque
  if (part.brand?.toLowerCase().includes(q)) {
    score += 20
  }

  // 🔹 Fournisseur favori ⭐
  if (
    favoriteSupplier &&
    part.supplier?.name.toLowerCase() === favoriteSupplier.toLowerCase()
  ) {
    score += 30
  }

  // 🔹 Priorité fournisseur (statique)
  if (part.supplier?.priority) {
    score += part.supplier.priority
  }

  return score
}
