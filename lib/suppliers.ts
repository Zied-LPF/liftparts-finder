export type Supplier = {
  id: string;
  name: string;
  baseUrl: string;
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
    autoSearch: false,
  },
];
