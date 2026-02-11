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
    autoSearch: false,
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
    <main
      style={{
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ marginBottom: "1rem" }}>LiftParts Finder</h1>

      {/* SEARCH */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          search();
        }}
        style={{ marginBottom: "2rem" }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Référence ou mot-clé"
          style={{
            padding: "0.6rem",
            width: "60%",
            marginRight: "0.5rem",
          }}
        />
        <button type="submit" style={{ padding: "0.6rem 1rem" }}>
          Rechercher
        </button>
      </form>

      {loading && <p>Recherche en cours…</p>}

      {/* RESULTS */}
      <div style={{ display: "grid", gap: "1rem" }}>
        {results.map((part) => (
          <div
            key={part.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "6px",
              padding: "1rem",
              backgroundColor: "#fafafa",
            }}
          >
            <h3 style={{ margin: "0 0 0.5rem 0" }}>{part.name}</h3>

            <div style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
              <strong>Référence :</strong> {part.reference}
              <br />
              <strong>Marque :</strong> {part.brand ?? "-"}
            </div>

            {/* SUPPLIERS */}
            <div
              style={{
                marginTop: "0.8rem",
                paddingTop: "0.5rem",
                borderTop: "1px solid #ddd",
              }}
            >
              <strong>Fournisseurs</strong>
              {SUPPLIERS.map((supplier) => (
                <div key={supplier.id} style={{ marginTop: "0.4rem" }}>
                  <a
                    href={supplier.baseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    🔗 {supplier.name}
                  </a>
                  <div style={{ fontSize: "0.8rem", color: "#666" }}>
                    ℹ️ Copiez la référence{" "}
                    <strong>{part.reference}</strong> dans la recherche du site
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
