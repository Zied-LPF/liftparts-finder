export type Supplier = {
  name: string
  baseUrl: string
  priority: number
  active: boolean
}

export const suppliers: Supplier[] = [
  {
    name: 'Sodimas',
    baseUrl: 'https://my.sodimas.com/fr/recherche?searchstring=',
    priority: 100,
    active: true,
  },
  {
    name: 'Elvacenter',
    baseUrl: 'https://shop.elvacenter.com/#/dfclassic/query=',
    priority: 90,
    active: true,
  },
  {
    name: 'Hauer',
    baseUrl: 'https://www.elevatorshop.de/fr#/dfclassic/query=',
    priority: 80,
    active: true,
  },
  {
    name: 'Kone',
    baseUrl: 'https://parts.kone.com/#/!1@&searchTerm=',
    priority: 70,
    active: true,
  },
  {
    name: 'MGTI',
    baseUrl:
      'https://www.mgti.fr/PBSearch.asp?ActionID=1&CCode=2&ShowSMImg=1&SearchText=',
    priority: 60,
    active: true,
  },
  {
    name: 'Sodica',
    baseUrl: 'https://www.sodica.fr/fr/search?SearchTerm=',
    priority: 50,
    active: true,
  },
  {
    name: 'RS',
    baseUrl: 'https://befr.rs-online.com/web/c/?searchTerm=',
    priority: 40,
    active: true,
  },
  {
    name: 'Cebeo',
    baseUrl: 'https://www.cebeo.be/catalog/fr-be/search/',
    priority: 30,
    active: true,
  },
]
