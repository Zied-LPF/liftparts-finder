import type { Supplier } from './suppliers'

type Part = {
  reference?: string
  brand?: string
}

export function computeScore(
  part: Part,
  supplier: Supplier
): number {
  let score = 0

  // Bonus si la marque de la pièce correspond aux marques du fournisseur
  if (
    part.brand &&
    supplier.brands &&
    supplier.brands.includes(part.brand)
  ) {
    score += 10
  }

  // Bonus si référence présente (logique simple, stable)
  if (part.reference) {
    score += 5
  }

  return score
}
