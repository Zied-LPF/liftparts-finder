// lib/suppliers.ts
import { searchMySodimas } from './connectors/mysodimas'
import { searchElvacenter } from './connectors/elvacenter'
import { searchElevatorshop } from './connectors/elevatorshop'
import { searchSodica } from './connectors/sodica'   // 🔹 existant
import { searchMGTI } from './connectors/mgti'       // 🔹 nouveau
import type { SupplierResult } from './types'

export interface Supplier {
  name: string
  search: (query: string) => Promise<SupplierResult[]>
}

// 🔹 Wrapper générique pour adapter les connecteurs
async function unwrapResults(
  searchFn: (query: string) => Promise<{ results: SupplierResult[], hasMore: boolean }>,
  query: string
): Promise<SupplierResult[]> {
  const { results } = await searchFn(query)
  return results
}

// 🔹 Liste des fournisseurs
export const suppliers: Supplier[] = [
  { name: 'MySodimas', search: (query) => unwrapResults(searchMySodimas, query) },
  { name: 'Elvacenter', search: (query) => unwrapResults(searchElvacenter, query) },
  { name: 'ElevatorShop', search: (query) => unwrapResults(searchElevatorshop, query) },
  { name: 'Sodica', search: (query) => unwrapResults(searchSodica, query) },
  { name: 'MGTI', search: (query) => unwrapResults(searchMGTI, query) }   // 🔹 ajouté
]