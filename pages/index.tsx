import { useState } from 'react'

type Result = {
  supplier: string
  title: string
  description: string
  image: string | null
  fallbackImage: string
  link: string
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!query) return

    setLoading(true)

    try {
      const res = await fetch(`/api/search-suppliers?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data || [])
    } catch (err) {
      console.error(err)
      setResults([])
    }

    setLoading(false)
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>LiftParts Finder</h1>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="Référence ou mot-clé..."
        style={{ padding: 10, width: 300 }}
      />

      <button onClick={handleSearch} style={{ marginLeft: 10 }}>
        Rechercher
      </button>

      {loading && <p>Recherche en cours...</p>}

      {results.map((r, i) => (
        <div key={i} style={{ marginTop: 30 }}>
          <h3>{r.supplier}</h3>
          <p>{r.title}</p>
          <a href={r.link} target="_blank">
            Voir produit
          </a>
        </div>
      ))}

      {!loading && results.length === 0 && query && (
        <p>Aucun résultat trouvé</p>
      )}
    </div>
  )
}
