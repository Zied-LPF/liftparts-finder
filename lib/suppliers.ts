export type Supplier = {
  name: string
  baseUrl: string
  priority: number
  active: boolean
}

export const SUPPLIERS: Supplier[] = [
  {
    name: 'MySodimas',
    baseUrl: 'https://www.mysodimas.com',
    priority: 100,
    active: true
  },
  {
    name: 'ElvaCenter',
    baseUrl: 'https://www.elvacenter.com',
    priority: 50,
    active: true
  },
  {
    name: 'ElevatorShop',
    baseUrl: 'https://www.elevatorshop.com',
    priority: 30,
    active: true
  },
  {
    name: 'LiftMaterial',
    baseUrl: 'https://www.liftmaterial.com',
    priority: 20,
    active: false // prêt mais désactivé
  }
]
