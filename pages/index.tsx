import { useState } from 'react'
import Link from 'next/link'

type Part = {
  id: string
  name: string
  reference: string
  brand?: string
  category?: string
  notes?: string
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [parts, setParts] = useState<Part[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const runSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    setSearched(true)

    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
    const data = await res.json()

    setParts(Array.isArray(data) ? data : [])
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

      {!loading && searched && parts.length === 0 && (
        <p style={{ color: '#666' }}>Aucune pièce trouvée</p>
      )}

      {!loading && parts.length > 0 && (
        <div style={{ maxWidth: 900 }}>
          {parts.map((part) => (
            <Link
              key={part.id}
              href={`/parts/${part.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div
                style={{
                  background: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 12,
                  transition: 'box-shadow 0.2s',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: 6,
                  }}
                >
                  <strong style={{ fontSize: 16 }}>
                    {part.name}
                  </strong>
                  <span
                    style={{
                      fontSize: 13,
                      color: '#666',
                      fontFamily: 'monospace',
                    }}
                  >
                    {part.reference}
                  </span>
                </div>

                {part.brand && (
                  <span
                    style={{
                      display: 'inline-block',
                      background: '#eef2f6',
                      padding: '4px 10px',
                      borderRadius: 12,
                      fontSize: 12,
                      marginBottom: 6,
                    }}
                  >
                    {part.brand}
                  </span>
                )}

                {part.notes && (
                  <p
                    style={{
                      marginTop: 8,
                      fontSize: 13,
                      color: '#333',
                    }}
                  >
                    {part.notes}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
