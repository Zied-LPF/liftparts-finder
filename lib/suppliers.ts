// lib/suppliers.ts
import { searchMySodimas } from './connectors/mysodimas'
import { searchElevatorshop } from './connectors/elevatorshop'
import { searchElvacenter } from './connectors/elvacenter'
import type { SupplierResult } from './types'

export interface Supplier {
  name: string
  search: (query: string) => Promise<SupplierResult[]>
}

// 🔹 Liste des fournisseurs
export const suppliers: Supplier[] = [
  { name: 'MySodimas', search: searchMySodimas },
  { name: 'ElevatorShop', search: searchElevatorshop },
  { name: 'Elvacenter', search: searchElvacenter } // peut retourner [] pour l'instant
]