export type Supplier = {
  name: string
  searchUrl: string
  priority: number
  active: boolean
  favorite?: boolean
}

export const SUPPLIERS: Supplier[] = [
  {
    name: 'Sodimas',
    searchUrl: 'https://my.sodimas.com/fr/recherche?searchstring=',
    priority: 100,
    active: true,
    favorite: true,
  },
  {
    name: 'Elvacenter',
    searchUrl: 'https://shop.elvacenter.com/#/dfclassic/query=',
    priority: 90,
    active: true,
  },
  {
    name: 'Hauer',
    searchUrl: 'https://www.elevatorshop.de/fr#/dfclassic/query=',
    priority: 85,
    active: true,
  },
  {
    name: 'Kone',
    searchUrl: 'https://parts.kone.com/#/!1@&searchTerm=',
    priority: 80,
    active: true,
  },
  {
    name: 'MGTI',
    searchUrl:
      'https://www.mgti.fr/PBSearch.asp?ActionID=1&CCode=2&ShowSMImg=1&SearchText=',
    priority: 75,
    active: true,
  },
  {
    name: 'Sodica',
    searchUrl: 'https://www.sodica.fr/fr/search?SearchTerm=',
    priority: 70,
    active: true,
  },
  {
    name: 'RS',
    searchUrl: 'https://befr.rs-online.com/web/c/?searchTerm=',
    priority: 65,
    active: true,
  },
  {
    name: 'Cebeo',
    searchUrl: 'https://www.cebeo.be/catalog/fr-be/search/',
    priority: 60,
    active: true,
  },
]
