import { useState } from "react"
import { SUPPLIERS } from "../lib/suppliers"

type Part = {
  id: string
  name: string
  reference: string
  brand: string
}

export default function Home() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Part[]>([])
  const [loading, setLoading] = useState(false)

  const search = async () => {
    if (!query.trim()) return

    setLoading(true)

    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(query.trim())}`
      )
      const data = await res.json()
      setResults(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>LiftParts Finder</h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Référence ou mot-clé"
      />

      <button onClick={search}>Rechercher</button>

      {loading && <p>Recherche…</p>}

      {!loading && results.length === 0 && query && (
        <p>Aucune pièce trouvée</p>
      )}

      <ul>
        {results.map((part) => (
          <li key={part.id} style={{ marginBottom: 20 }}>
            <strong>{part.name}</strong>
            <br />
            Référence : {part.reference}
            <br />
            Marque : {part.brand}

            <ul>
              {SUPPLIERS.filter((s) => s.active).map((supplier) => {
                const url =
                  supplier.baseUrl +
                  "?" +
                  supplier.searchParam +
                  "=" +
                  encodeURIComponent(part.reference)

                return (
                  <li key={supplier.name}>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      🔗 {supplier.name}
                    </a>
                  </li>
                )
              })}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  )
}
