// lib/suppliers.ts
import { searchMySodimas } from './connectors/mysodimas'
import { searchElevatorshop } from './connectors/elevatorshop'
import { searchElvacenter } from './connectors/elvacenter'
import type { SupplierResult } from './types'

export interface Supplier {
  name: string
  search: (query: string) => Promise<SupplierResult[]>
}

// 🔹 Wrapper simple pour Elvacenter
async function searchElvacenterSimple(query: string): Promise<SupplierResult[]> {
  const { results } = await searchElvacenter(query)
  return results
}

// 🔹 Liste des fournisseurs
export const suppliers: Supplier[] = [
  { name: 'MySodimas', search: searchMySodimas },
  { name: 'ElevatorShop', search: searchElevatorshop },
  { name: 'Elvacenter', search: searchElvacenterSimple }
]