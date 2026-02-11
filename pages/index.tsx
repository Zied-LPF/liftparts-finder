import { useState } from "react";

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
    if (!query.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      console.log("API result:", data); // 👈 DEBUG CRUCIAL

      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 40 }}>
      <h1>LiftParts Finder</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Référence ou mot-clé"
          style={{ marginRight: 10 }}
        />
        <button onClick={search}>Rechercher</button>
      </div>

      {loading && <p>Recherche en cours…</p>}

      {!loading && results.length === 0 && query && (
        <p>Aucune pièce trouvée</p>
      )}

      <ul>
        {results.map((part) => (
          <li key={part.id}>
            <strong>{part.name}</strong>
            <br />
            Référence : {part.reference}
            <br />
            Marque : {part.brand}
          </li>
        ))}
      </ul>
    </main>
  );
}
