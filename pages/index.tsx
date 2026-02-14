import { useState } from 'react'

type SupplierResult = {
  supplier: string
  title: string | null
  description: string | null
  reference: string | null
  image: string | null
  fallbackImage: string
  link: string
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
    setResults(await res.json())
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
          style={{ flex: 1, padding: 12 }}
        />
        <button onClick={runSearch}>Rechercher</button>
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
              style={{ background: '#fff', padding: 20, borderRadius: 8 }}
            >
              <h3>{r.supplier}</h3>

              <div
                style={{
                  height: 180,
                  border: '1px solid #ddd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
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

              <div style={{ fontSize: 12, marginTop: 4, color: '#666' }}>
                Recherche : {lastSearch}
              </div>

              <a
                href={r.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  marginTop: 12,
                  background: '#0d6efd',
                  color: '#fff',
                  textAlign: 'center',
                  padding: 10,
                  borderRadius: 6,
                  textDecoration: 'none',
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
