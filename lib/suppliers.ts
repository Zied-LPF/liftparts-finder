export type Supplier = {
  name: string
  baseUrl: string
  priority: number
  active: boolean
  favorite?: boolean
}

export const SUPPLIERS: Supplier[] = [
  {
    name: 'MySodimas',
    baseUrl: 'https://mysodimas.sodimas.com',
    priority: 100,
    active: true,
    favorite: true,
  },
  {
    name: 'Sodimas',
    baseUrl: 'https://www.sodimas.com',
    priority: 80,
    active: true,
  },
  {
    name: 'Otis',
    baseUrl: 'https://www.otis.com',
    priority: 70,
    active: true,
  },
]
