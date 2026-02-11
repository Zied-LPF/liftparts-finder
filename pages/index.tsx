import { useState } from "react";
import { suppliers } from "../lib/suppliers";

type Part = {
  id: string;
  name: string;
  reference: string;
  brand: string;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Part[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!query) return;
    setLoading(true);

    const res = await fetch(`/api/search?q=${query}`);
    const data = await res.json();

    setResults(data);
    setLoading(false);
  };

  return (
    <main style={{ padding: 30 }}>
      <h1>LiftParts Finder</h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Référence ou mot-clé"
      />
      <button onClick={search}>Rechercher</button>

      {loading && <p>Recherche…</p>}

      <ul>
        {results.map((part) => (
          <li key={part.id} style={{ marginTop: 20 }}>
            <strong>{part.name}</strong>
            <br />
            Référence : {part.reference}
            <br />
            Marque : {part.brand}

            <div style={{ marginTop: 10 }}>
              {suppliers.map((supplier) => (
                <div key={supplier.id}>
                  <a
                    href={supplier.baseUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    🔗 {supplier.name}
                  </a>
                  <div
                    style={{
                      fontSize: "0.85em",
                      color: "#666",
                      marginLeft: 10,
                    }}
                  >
                    ℹ️ Copiez la référence{" "}
                    <strong>{part.reference}</strong> dans leur champ de recherche
                  </div>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
