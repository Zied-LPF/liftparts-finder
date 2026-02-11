import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const search = async () => {
    const res = await fetch(`/api/search?q=${query}`);
    const data = await res.json();
    setResults(data);
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>LiftParts Finder</h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Référence pièce"
      />
      <button onClick={search}>Rechercher</button>

      <ul>
        {results.map((part) => (
          <li key={part.id}>
            <strong>{part.name}</strong>
            <br />
            Référence : {part.reference}
            <br />
            Marque : {part.brand}

            {part.supplierLinks?.length > 0 && (
              <>
                <br />
                <strong>Fournisseurs :</strong>
                <ul>
                  {part.supplierLinks.map((s: any) => (
                    <li key={s.name}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer">
                        {s.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
