// lib/suppliers.ts
import { searchMySodimas } from './connectors/mysodimas'
import { searchElvacenter } from './connectors/elvacenter'
import { searchElevatorshop } from './connectors/elevatorshop'
import { searchSodica } from './connectors/sodica'
import { searchMGTI } from './connectors/mgti'
import { searchKone } from './connectors/kone'
import { searchDonati } from './connectors/donati' 
import { searchHissmekano } from './connectors/hissmekano'
import { searchLiftshop } from './connectors/liftshop'

import type { SupplierResult } from './types'

export interface Supplier {
  name: string
  search: (query: string) => Promise<SupplierResult[]>
}

// 🔹 Wrapper générique
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
  { name: 'MGTI', search: (query) => unwrapResults(searchMGTI, query) },
  { name: 'KONE', search: (query) => unwrapResults(searchKone, query) },
  { name: 'Donati', search: (query) => unwrapResults(searchDonati, query) },
  { name: 'Hissmekano', search: (query) => unwrapResults(searchHissmekano, query) },
  { name: 'LiftShop', search: (query) => unwrapResults(searchLiftshop, query) }
]