import { useState } from "react";
import { suppliers } from "../lib/suppliers";

type Part = {
  id: string;
  name: string;
  reference: string;
  brand: string | null;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Part[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(query.trim())}`
      );

      if (!res.ok) {
        setError("Erreur serveur");
        return;
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        setError("Réponse invalide");
        return;
      }

      setResults(data);
    } catch (e) {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>LiftParts Finder</h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && search()}
        placeholder="Référence pièce (ex: LCB2)"
      />
      <button onClick={search}>Rechercher</button>

      {loading && <p>Recherche en cours…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {results.map((part) => (
          <li key={part.id} style={{ marginTop: 12 }}>
            <strong>{part.name}</strong>
            <br />
            Référence : {part.reference}
            <br />
            Marque : {part.brand ?? "-"}

            <div style={{ marginTop: 6 }}>
              {suppliers.map((s) => {
                const url = s.searchParam
                  ? `${s.baseUrl}?${s.searchParam}=${part.reference}`
                  : s.baseUrl;

                return (
                  <a
                    key={s.id}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ marginRight: 10 }}
                  >
                    🔗 {s.name}
                  </a>
                );
              })}
            </div>
          </li>
        ))}
      </ul>

      {!loading && results.length === 0 && query && (
        <p>Aucune pièce trouvée</p>
      )}
    </main>
  );
}
