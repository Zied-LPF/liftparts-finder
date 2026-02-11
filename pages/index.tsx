import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>LiftParts Finder</h1>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Référence ou mot-clé"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: "0.5rem", width: "250px" }}
        />
        <button
          onClick={handleSearch}
          style={{ marginLeft: "0.5rem", padding: "0.5rem 1rem" }}
        >
          Rechercher
        </button>
      </div>

      {loading && <p>Recherche en cours…</p>}

      {!loading && results.length === 0 && query && (
        <p>Aucun résultat</p>
      )}

      <ul>
        {results.map((item, index) => (
          <li key={index}>
            <strong>{item.reference}</strong>
            {item.description ? ` — ${item.description}` : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
