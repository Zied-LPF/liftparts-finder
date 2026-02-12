export type Supplier = {
  name: string
  baseUrl: string
  brands?: string[]
}

export const suppliers: Supplier[] = [
  {
    name: 'Sodimas',
    baseUrl: 'https://my.sodimas.com/fr/recherche?searchstring=',
    brands: ['Sodimas'],
  },
  {
    name: 'Elvacenter',
    baseUrl: 'https://shop.elvacenter.com/#/dfclassic/query=',
  },
  {
    name: 'Hauer',
    baseUrl: 'https://www.elevatorshop.de/fr#/dfclassic/query=',
  },
  {
    name: 'Kone',
    baseUrl: 'https://parts.kone.com/#/!1@&searchTerm=',
    brands: ['Kone'],
  },
  {
    name: 'MGTI',
    baseUrl: 'https://www.mgti.fr/PBSearch.asp?ActionID=1&CCode=2&ShowSMImg=1&SearchText=',
  },
  {
    name: 'Sodica',
    baseUrl: 'https://www.sodica.fr/fr/search?SearchTerm=',
  },
  {
    name: 'RS',
    baseUrl: 'https://befr.rs-online.com/web/c/?searchTerm=',
  },
  {
    name: 'Cebeo',
    baseUrl: 'https://www.cebeo.be/catalog/fr-be/search/',
  },
]
