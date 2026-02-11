export type Supplier = {
  name: string;
  baseUrl: string;
  priority: number;
  active: boolean;
};

export const SUPPLIERS: Supplier[] = [
  {
    name: "MySodimas",
    baseUrl: "https://www.mysodimas.com",
    priority: 100,
    active: true,
  },
  {
    name: "ElvaCenter",
    baseUrl: "https://www.elvacenter.com",
    priority: 50,
    active: true,
  },
  {
    name: "ElevatorShop",
    baseUrl: "https://www.elevatorshop.de/fr/",
    priority: 30,
    active: true,
  },
];

export function getRankedSuppliers(): Supplier[] {
  return [...SUPPLIERS]
    .filter((s) => s.active)
    .sort((a, b) => b.priority - a.priority);
}

/**
 * Génère une URL fournisseur avec recherche pré-remplie
 */
export function buildSupplierSearchUrl(
  supplier: Supplier,
  reference: string
): string {
  return `${supplier.baseUrl}?search=${encodeURIComponent(reference)}`;
}
