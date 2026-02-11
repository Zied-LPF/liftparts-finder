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
  favorite?: boolean;
};

const SUPPLIERS: Supplier[] = [
  {
    id: "mysodimas",
    name: "MySodimas",
    baseUrl: "https://www.mysodimas.com",
    autoSearch: false,
    favorite: true, // prêt pour le scoring métier
  },
  {
    id: "elevatorshop",
    name: "ElevatorShop",
    baseUrl: "https://www.elevatorshop.de/fr/",
    autoSearch: false,
  },
];

function Badge({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 6px",
        fontSize: "0.7rem",
        borderRadius: "4px",
        backgroundColor: color,
        color: "#fff",
        marginLeft: "6px",
      }}
    >
      {label}
    </span>
  );
}

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
      <h1>LiftParts Finder</h1>

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
            <h3>{part.name}</h3>

            <div style={{ fontSize: "0.9rem" }}>
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

                  {supplier.favorite && (
                    <Badge label="FAVORI" color="#f5a623" />
                  )}

                  {supplier.autoSearch ? (
                    <Badge label="AUTO" color="#2ecc71" />
                  ) : (
                    <Badge label="MANUEL" color="#3498db" />
                  )}

                  {!supplier.autoSearch && (
                    <div style={{ fontSize: "0.8rem", color: "#666" }}>
                      ℹ️ Copier la référence{" "}
                      <strong>{part.reference}</strong> dans la recherche du site
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
