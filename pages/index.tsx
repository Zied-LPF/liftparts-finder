import { useState } from "react";

type Part = {
  id: string;
  name: string;
  reference: string;
  brand: string | null;
  category: string | null;
  notes: string | null;
  is_favorite: boolean;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Part[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur inconnue");
      }

      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
      <h1>LiftParts Finder</h1>

      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Référence ou mot-clé"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: 8, width: 260, marginRight: 8 }}
          onKeyDown={(e) => e.key === "Enter" && search()}
        />
        <button onClick={search} disabled={loading}>
          {loading ? "Recherche..." : "Rechercher"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {results.length > 0 && (
        <ul>
          {results.map((part) => (
            <li key={part.id} style={{ marginBottom: 12 }}>
              <strong>{part.name}</strong>
              <br />
              Référence : {part.reference}
              <br />
              Marque : {part.brand ?? "—"}
            </li>
          ))}
        </ul>
      )}

      {!loading && results.length === 0 && query && (
        <p>Aucun résultat trouvé.</p>
      )}
    </main>
  );
}
