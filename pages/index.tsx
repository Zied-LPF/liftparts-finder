import { useState } from 'react'

type SupplierResult = {
  supplier: string
  title: string
  image?: string
  link: string
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SupplierResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const runSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    setSearched(true)

    const res = await fetch(
      `/api/search-suppliers?q=${encodeURIComponent(query)}`
    )
    const data = await res.json()

    setResults(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  return (
    <main
      style={{
        padding: 32,
        fontFamily: 'Arial, sans-serif',
        background: '#f4f6f8',
        minHeight: '100vh',
      }}
    >
      <h1 style={{ marginBottom: 24, fontSize: 26 }}>
        🔧 LiftParts Finder
      </h1>

      {/* Recherche */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: 28,
          maxWidth: 640,
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && runSearch()}
          placeholder="Référence ou mot-clé (ex: contact, SOD-LOCK…)"
          style={{
            flex: 1,
            padding: '12px 14px',
            fontSize: 15,
            borderRadius: 6,
            border: '1px solid #ccc',
          }}
        />
        <button
          onClick={runSearch}
          style={{
            padding: '12px 18px',
            fontSize: 14,
            cursor: 'pointer',
            borderRadius: 6,
            border: '1px solid #888',
            background: '#fff',
          }}
        >
          Rechercher
        </button>
      </div>

      {loading && <p>Recherche en cours…</p>}

      {!loading && searched && results.length === 0 && (
        <p style={{ color: '#666' }}>Aucun résultat fournisseur</p>
      )}

      {!loading && results.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 16,
            maxWidth: 1000,
          }}
        >
          {results.map((r) => (
            <div
              key={r.supplier}
              style={{
                background: '#fff',
                borderRadius: 10,
                padding: 16,
                border: '1px solid #ddd',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <strong style={{ marginBottom: 8 }}>
                {r.supplier}
              </strong>

              <div
                style={{
                  height: 180,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}
              >
                {r.image ? (
                  <img
                    src={r.image}
                    alt={r.title}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  <span style={{ fontSize: 12, color: '#999' }}>
                    Aucune image
                  </span>
                )}
              </div>

              <div style={{ flexGrow: 1 }}>
                <p style={{ fontSize: 14 }}>{r.title}</p>
              </div>

              <a
                href={r.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginTop: 12,
                  textAlign: 'center',
                  padding: '10px 12px',
                  borderRadius: 6,
                  background: '#0070f3',
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: 14,
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
