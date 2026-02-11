export type Supplier = {
  id: string;
  name: string;
  baseUrl: string;
  searchParam?: string;
};

export const suppliers: Supplier[] = [
  {
    id: "mysodimas",
    name: "MySodimas",
    baseUrl: "https://my.sodimas.com/",
    searchParam: "search",
  },
  {
    id: "elevatorshop",
    name: "ElevatorShop",
    baseUrl: "https://elevatorshop.de/fr/",
    // pas de recherche auto → page d’accueil uniquement
  },
];
