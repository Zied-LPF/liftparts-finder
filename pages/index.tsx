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

  const search = async () => {
    if (!query.trim()) return
    setLoading(true)

    try {
      const res = await fetch(`/api/search-suppliers?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
      setResults([])
    }

    setLoading(false)
  }

  return (
    <main style={{ padding: 24, background: '#f4f6f8', minHeight: '100vh' }}>
      <h1 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        🔧 LiftParts Finder
      </h1>

      {/* SEARCH */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          placeholder="Référence ou mot-clé"
          style={{
            flex: 1,
            padding: 10,
            fontSize: 16,
            borderRadius: 4,
            border: '1px solid #ccc',
          }}
        />
        <button
          onClick={search}
          style={{
            padding: '10px 16px',
            fontSize: 16,
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Rechercher
        </button>
      </div>

      {/* RESULTS */}
      {loading && <p>Recherche en cours…</p>}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
        }}
      >
        {results.map((r, idx) => (
          <div
            key={idx}
            style={{
              background: '#fff',
              padding: 16,
              borderRadius: 6,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <h3>{r.supplier}</h3>

            {/* IMAGE */}
            <div
              style={{
                width: '100%',
                height: 200,
                border: '1px solid #ddd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fafafa',
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
                <span style={{ fontSize: 12, color: '#888' }}>
                  Aucune image
                </span>
              )}
            </div>

            {/* TITLE */}
            <div style={{ flex: 1 }}>
              <strong>{r.title}</strong>
            </div>

            {/* LINK */}
            <a
              href={r.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textAlign: 'center',
                background: '#0070f3',
                color: '#fff',
                padding: 10,
                borderRadius: 4,
                textDecoration: 'none',
              }}
            >
              Voir chez {r.supplier}
            </a>
          </div>
        ))}
      </div>
    </main>
  )
}
