import { useState } from 'react'

type SupplierResult = {
  name: string
  searchUrl: string
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SupplierResult[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setLoading(true)

    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
    const data = await res.json()

    setResults(data)
    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>🔧 LiftParts Finder</h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Rechercher une pièce"
        style={{ marginRight: 10 }}
      />

      <button onClick={handleSearch}>Rechercher</button>

      {loading && <p>Recherche en cours…</p>}

      {!loading && query && results.length === 0 && (
        <p>Aucun fournisseur trouvé</p>
      )}

      <ul style={{ marginTop: 20 }}>
        {results.map((r) => (
          <li key={r.name} style={{ marginBottom: 10 }}>
            <strong>{r.name}</strong>
            <br />
            <a href={r.searchUrl} target="_blank" rel="noopener noreferrer">
              Voir chez le fournisseur
            </a>
          </li>
        ))}
      </ul>
    </main>
  )
}
