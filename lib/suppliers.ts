export type Supplier = {
  name: string
  baseUrl: string
  searchParam: string
  active: boolean
}

export const SUPPLIERS: Supplier[] = [
  {
    name: "MySodimas",
    baseUrl: "https://www.mysodimas.com/search",
    searchParam: "search",
    active: true,
  },
  {
    name: "ElevatorShop",
    baseUrl: "https://www.elevatorshop.de/fr/",
    searchParam: "search",
    active: true,
  },
  {
    name: "ElvaCenter",
    baseUrl: "https://www.elvacenter.com/search",
    searchParam: "query",
    active: true,
  },
]
