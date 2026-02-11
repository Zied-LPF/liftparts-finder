import { useState } from "react";

type Part = {
  id: string;
  name: string;
  reference: string;
  brand: string | null;
  favorite_supplier_id: string | null;
};

type Supplier = {
  id: string;
  name: string;
  baseUrl: string;
};

const SUPPLIERS: Supplier[] = [
  {
    id: "mysodimas",
    name: "MySodimas",
    baseUrl: "https://www.mysodimas.com",
  },
  {
    id: "elevatorshop",
    name: "ElevatorShop",
    baseUrl: "https://www.elevatorshop.de/fr/",
  },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Part[]>([]);
  const [loading, setLoading] = useState(false);

  async function search() {
    if (!query) return;

    setLoading(true);
    setResults([]);

    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data);
    setLoading(false);
  }

  async function setFavorite(partId: string, supplierId: string) {
    await fetch("/api/favorite", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partId, supplierId }),
    });

    setResults((prev) =>
      prev.map((p) =>
        p.id === partId
          ? { ...p, favorite_supplier_id: supplierId }
          : p
      )
    );
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1>LiftParts Finder</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          search();
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Référence"
        />
        <button type="submit">Rechercher</button>
      </form>

      {loading && <p>Recherche en cours…</p>}

      {results.map((part) => (
        <div
          key={part.id}
          style={{
            border: "1px solid #ddd",
            padding: "1rem",
            marginTop: "1rem",
          }}
        >
          <h3>{part.name}</h3>
          <div>Réf : {part.reference}</div>
          <div>Marque : {part.brand ?? "-"}</div>

          <strong>Fournisseurs</strong>

          {SUPPLIERS.map((supplier) => {
            const isFav = part.favorite_supplier_id === supplier.id;

            return (
              <div key={supplier.id}>
                <a href={supplier.baseUrl} target="_blank">
                  🔗 {supplier.name}
                </a>

                <button
                  onClick={() => setFavorite(part.id, supplier.id)}
                  style={{
                    marginLeft: "8px",
                    cursor: "pointer",
                    color: isFav ? "gold" : "#999",
                  }}
                >
                  ⭐
                </button>

                {isFav && <span> Favori</span>}
              </div>
            );
          })}
        </div>
      ))}
    </main>
  );
}
