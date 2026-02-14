import { useState } from 'react'

type SupplierResult = {
  supplier: string
  title: string | null
  description: string | null
  reference: string | null
  image: string | null
  fallbackImage: string
  link: string
  score: number
  exactMatch: boolean
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SupplierResult[]>([])
  const [loading, setLoading] = useState(false)
  const [lastSearch, setLastSearch] = useState('')

  const runSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setLastSearch(query.trim())

    const res = await fetch(
      `/api/search-suppliers?q=${encodeURIComponent(query.trim())}`
    )

    const data = await res.json()
    setResults(data)
    setLoading(false)
  }

  return (
    <main style={{ padding: 32, background: '#f4f6f8', minHeight: '100vh' }}>
      <h1>🔧 LiftParts Finder</h1>

      <div style={{ display: 'flex', gap: 12, margin: '24px 0' }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && runSearch()}
          placeholder="Référence pièce"
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 6,
            border: '1px solid #ccc',
          }}
        />
        <button
          onClick={runSearch}
          style={{
            padding: '12px 20px',
            background: '#0d6efd',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Rechercher
        </button>
      </div>

      {loading && <p>Recherche en cours…</p>}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))',
          gap: 24,
        }}
      >
        {results.map((r) => {
          const imageToShow = r.image || r.fallbackImage

          return (
            <div
              key={r.supplier}
              style={{
                background: '#fff',
                padding: 20,
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              }}
            >
              <h3 style={{ marginBottom: 8 }}>{r.supplier}</h3>

              {r.exactMatch && (
                <div
                  style={{
                    background: '#198754',
                    color: '#fff',
                    padding: '4px 8px',
                    fontSize: 12,
                    borderRadius: 4,
                    display: 'inline-block',
                    marginBottom: 12,
                  }}
                >
                  MATCH EXACT
                </div>
              )}

              <div
                style={{
                  height: 180,
                  border: '1px solid #ddd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                  borderRadius: 6,
                  overflow: 'hidden',
                }}
              >
                <img
                  src={imageToShow}
                  alt={r.title ?? r.supplier}
                  style={{ maxHeight: '100%', maxWidth: '100%' }}
                />
              </div>

              <strong>
                {r.title ?? 'Résultats disponibles chez ce fournisseur'}
              </strong>

              {r.description && (
                <p style={{ fontSize: 13, color: '#555', marginTop: 6 }}>
                  {r.description}
                </p>
              )}

              {r.reference && (
                <div
                  style={{
                    fontSize: 12,
                    fontFamily: 'monospace',
                    color: '#666',
                    marginTop: 6,
                  }}
                >
                  Référence fournisseur : {r.reference}
                </div>
              )}

              <div style={{ fontSize: 12, marginTop: 4, color: '#999' }}>
                Recherche : {lastSearch}
              </div>

              <a
                href={r.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  marginTop: 14,
                  background: '#0d6efd',
                  color: '#fff',
                  textAlign: 'center',
                  padding: 10,
                  borderRadius: 6,
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                Voir chez {r.supplier}
              </a>
            </div>
          )
        })}
      </div>
    </main>
  )
}
