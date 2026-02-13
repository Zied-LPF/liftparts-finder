import { useState } from 'react'

type Result = {
  supplier: string
  searchedValue: string
  productRef?: string
  title?: string
  description?: string
  image?: string
  link: string
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)

  const search = async () => {
    if (!query.trim()) return

    setLoading(true)
    setResults([])

    try {
      const res = await fetch(
        `/api/search-suppliers?q=${encodeURIComponent(query)}`
      )
      const data = await res.json()
      setResults(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error('Search error', e)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>🔧 LiftParts Finder</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Référence pièce"
          style={{ width: 300, marginRight: 10 }}
        />
        <button onClick={search}>Rechercher</button>
      </div>

      {loading && <p>Recherche en cours…</p>}

      {results.map((r, i) => (
        <div
          key={i}
          style={{
            border: '1px solid #ddd',
            padding: 16,
            marginBottom: 16
          }}
        >
          <h3>{r.supplier}</h3>

          <p>
            <strong>Recherche :</strong> {r.searchedValue}
          </p>

          {r.title && (
            <p>
              <strong>Produit :</strong> {r.title}
            </p>
          )}

          {r.productRef && (
            <p>
              <strong>Référence fournisseur :</strong> {r.productRef}
            </p>
          )}

          {r.image ? (
            <img
              src={r.image}
              alt={r.title || r.supplier}
              style={{ maxWidth: 200 }}
            />
          ) : (
            <p>(Image fournisseur)</p>
          )}

          <div style={{ marginTop: 10 }}>
            <a href={r.link} target="_blank">
              Voir chez {r.supplier}
            </a>
          </div>
        </div>
      ))}
    </main>
  )
}
