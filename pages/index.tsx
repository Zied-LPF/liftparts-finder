import { useEffect, useState } from "react";
import { searchParts } from "../lib/search";
import { suppliers } from "../lib/suppliers";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleSearch() {
    const data = await searchParts(query, suppliers);
    setResults(data);
  }

  // ⛔ empêche toute exécution Supabase au build
  if (!mounted) return null;

  return (
    <main style={{ padding: 20 }}>
      <h1>LiftParts Finder</h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Référence ou mot-clé"
      />

      <button onClick={handleSearch}>Rechercher</button>

      <ul>
        {results.map((item) => (
          <li key={item.id}>
            {item.reference} – {item.brand}
          </li>
        ))}
      </ul>
    </main>
  );
}
