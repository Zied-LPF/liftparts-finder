import { useState } from "react";

type Part = {
  id: string;
  name: string;
  reference: string;
  brand: string | null;
};

type Supplier = {
  id: string;
  name: string;
  baseUrl: string;
  searchUrl?: string;
  autoSearch: boolean;
};

const SUPPLIERS: Supplier[] = [
  {
    id: "mysodimas",
    name: "MySodimas",
    baseUrl: "https://www.mysodimas.com",
    autoSearch: false,
  },
  {
    id: "elevatorshop",
    name: "ElevatorShop",
    baseUrl: "https://www.elevatorshop.de/fr/",
    autoSearch: false, // confirmé : pas de recherche auto
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

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la recherche");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>LiftParts Finder</h1>

      {/* 🔍 SEARCH */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          search();
        }}
        style={{ marginBottom: "1.5rem" }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Référence ou mot-clé"
          style={{ marginRight: "0.5rem", padding: "0.4rem" }}
        />
        <button type="submit">Rechercher</button>
      </form>

      {loading && <p>Recherche en cours…</p>}

      {/* 📦 RESULTS */}
      <ul>
        {results.map((part) => (
          <li key={part.id} style={{ marginBottom: "1.2rem" }}>
            <strong>{part.name}</strong>
            <div>Référence : {part.reference}</div>
            <div>Marque : {part.brand ?? "-"}</div>

            {/* 🔗 SUPPLIERS */}
            <div style={{ marginTop: "0.5rem" }}>
              {SUPPLIERS.map((supplier) => (
                <div key={supplier.id}>
                  <a
                    href={supplier.baseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    🔗 {supplier.name}
                  </a>
                  {!supplier.autoSearch && (
                    <div style={{ fontSize: "0.85em", color: "#666" }}>
                      ℹ️ Copiez la référence{" "}
                      <strong>{part.reference}</strong> dans la recherche du
                      site
                    </div>
                  )}
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
