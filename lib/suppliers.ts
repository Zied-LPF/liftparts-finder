export type Supplier = {
  name: string
  baseUrl: string
  type: 'HTML' | 'SPA'
  hashId?: string        // Pour Doofinder
  apiKey?: string        // Pour Doofinder
  brands?: string[]
}

export const suppliers: Supplier[] = [
  {
    name: 'MGTI',
    baseUrl: 'https://www.mgti.fr/PBSearch.asp?ActionID=1&CCode=2&ShowSMImg=1&SearchText=',
    type: 'HTML'
  },
  {
    name: 'Sodica',
    baseUrl: 'https://www.sodica.fr/fr/search?SearchTerm=',
    type: 'HTML'
  },
  {
    name: 'ElvaCenter',
    baseUrl: 'https://shop.elvacenter.com/#/dfclassic/query=',
    type: 'SPA',
    hashId: process.env.DOOFINDER_HASHID,
    apiKey: process.env.DOOFINDER_API_KEY
  },
  {
    name: 'Kone',
    baseUrl: 'https://parts.kone.com/#/!1@&searchTerm=',
    type: 'SPA',
    hashId: process.env.DOOFINDER_HASHID,
    apiKey: process.env.DOOFINDER_API_KEY
  },
  {
    name: 'RS Online',
    baseUrl: 'https://befr.rs-online.com/web/c/?searchTerm=',
    type: 'HTML'
  },
  {
    name: 'Cebeo',
    baseUrl: 'https://www.cebeo.be/catalog/fr-be/search/',
    type: 'HTML'
  },
  {
    name: 'MySodimas',
    baseUrl: 'https://my.sodimas.com/fr/recherche?searchstring=',
    type: 'HTML'
  }
]
