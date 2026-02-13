import { useState } from 'react'

type SupplierResult = {
  supplier: string
  title: string | null
  image: string | null
  link: string
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SupplierResult[]>([])
  const [loading, setLoading] = useState(false)

  const runSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    const res = await fetch(
      `/api/search-suppliers?q=${encodeURIComponent(query)}`
    )
    const data = await res.json()
    setResults(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  return (
    <main style={{ padding: 32, background: '#f4f6f8', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: 24 }}>🔧 LiftParts Finder</h1>

      {/* Recherche */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && runSearch()}
          placeholder="Référence pièce (ex: KM846291G02)"
          style={{ flex: 1, padding: 12 }}
        />
        <button onClick={runSearch}>Rechercher</button>
      </div>

      {loading && <p>Recherche en cours…</p>}

      {!loading && results.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24,
          }}
        >
          {results.map((r) => (
            <div
              key={r.supplier}
              style={{
                background: '#fff',
                borderRadius: 8,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <h3>{r.supplier}</h3>

              {/* Image */}
              <div
                style={{
                  height: 180,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #ddd',
                }}
              >
                {r.image ? (
                  <img
                    src={r.image}
                    alt={r.title ?? r.supplier}
                    style={{ maxHeight: '100%', maxWidth: '100%' }}
                  />
                ) : (
                  <span style={{ color: '#888' }}>Aucune image</span>
                )}
              </div>

              {/* Texte */}
              <div>
                <strong>
                  {r.title ?? 'Résultats disponibles chez ce fournisseur'}
                </strong>
                <div
                  style={{
                    fontSize: 12,
                    color: '#666',
                    marginTop: 4,
                    fontFamily: 'monospace',
                  }}
                >
                  Recherche : {query}
                </div>
              </div>

              {/* Lien */}
              <a
                href={r.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginTop: 'auto',
                  textAlign: 'center',
                  padding: 12,
                  background: '#0d6efd',
                  color: '#fff',
                  borderRadius: 6,
                  textDecoration: 'none',
                }}
              >
                Voir chez {r.supplier}
              </a>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
