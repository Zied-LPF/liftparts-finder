import { useState } from "react"

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
    if (!query.trim()) {
      setResults([])
      return
    }

    setLoading(true)

    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(query.trim())}`
      )

      const data = await res.json()
      console.log("API result:", data)

      setResults(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error("Search error", e)
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

      <button onClick={search} disabled={loading}>
        Rechercher
      </button>

      {loading && <p>Recherche…</p>}

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
  )
}
