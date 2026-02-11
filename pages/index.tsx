import { useState } from 'react'

type Result = {
  name: string
  searchUrl: string
  score: number
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)

  const runSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
    const data = await res.json()

    // sécurité + tri par score décroissant
    const sorted = Array.isArray(data)
      ? data.sort((a, b) => b.score - a.score)
      : []

    setResults(sorted)
    setLoading(false)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') runSearch()
  }

  return (
    <main
      style={{
        padding: 24,
        fontFamily: 'Arial, sans-serif',
        background: '#f5f5f5',
        minHeight: '100vh',
      }}
    >
      <h1 style={{ marginBottom: 20 }}>🔧 LiftParts Finder</h1>

      {/* Barre de recherche */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          marginBottom: 24,
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Référence ou mot-clé"
          style={{
            padding: 10,
            width: 260,
            fontSize: 14,
          }}
        />
        <button
          onClick={runSearch}
          style={{
            padding: '10px 16px',
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          Rechercher
        </button>
      </div>

      {loading && <p>Recherche en cours…</p>}

      {!loading && results.length > 0 && (
        <div style={{ maxWidth: 720 }}>
          {results.map((r, index) => (
            <div
              key={r.name}
              style={{
                background: '#fff',
                border: '1px solid #ddd',
                borderRadius: 4,
                padding: 12,
                marginBottom: 10,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <strong>
                  {index === 0 ? '⭐ ' : ''}
                  {r.name}
                </strong>
              </div>

              <a
                href={r.searchUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '6px 12px',
                  border: '1px solid #000',
                  textDecoration: 'none',
                  fontSize: 13,
                }}
              >
                Voir chez le fournisseur →
              </a>
            </div>
          ))}
        </div>
      )}

      {!loading && results.length === 0 && query && (
        <p>Aucun fournisseur trouvé</p>
      )}
    </main>
  )
}
