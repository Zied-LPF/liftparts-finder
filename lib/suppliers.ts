export type Supplier = {
  id: string;
  name: string;
  baseUrl: string;
  searchUrl?: string;
  autoSearch: boolean;
};

export const suppliers: Supplier[] = [
  {
    id: "mysodimas",
    name: "MySodimas",
    baseUrl: "https://my.sodimas.com",
    autoSearch: false,
  },
  {
    id: "elevatorshop",
    name: "ElevatorShop",
    baseUrl: "https://www.elevatorshop.de/fr/",
    searchUrl: "https://www.elevatorshop.de/fr/?search=",
    autoSearch: true,
  },
];
