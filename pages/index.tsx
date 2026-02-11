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

  const search = async () => {
    if (!query) return;

    setLoading(true);
    setResults([]);

    try {
      const res = await fetch(`/api/search?q=${query}`);

      if (!res.ok) {
        console.error("API error");
        setResults([]);
        return;
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("Invalid response:", data);
        setResults([]);
        return;
      }

      setResults(data);
    } catch (err) {
      console.error("Fetch crash:", err);
      setResults([]);
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
        placeholder="Référence pièce"
      />
      <button onClick={search}>Rechercher</button>

      {loading && <p>Recherche...</p>}

      <ul>
        {results.map((part) => (
          <li key={part.id} style={{ marginTop: 10 }}>
            <strong>{part.name}</strong>
            <br />
            Référence : {part.reference}
            <br />
            Marque : {part.brand ?? "-"}
            <br />

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
          </li>
        ))}
      </ul>
    </main>
  );
}
