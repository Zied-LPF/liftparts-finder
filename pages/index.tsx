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
    setResults(data)
    setLoading(false)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runSearch()
    }
  }

  return (
    <main style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>LiftParts Finder</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Référence ou mot-clé"
          style={{ padding: 6, width: 240 }}
        />
        <button
          onClick={runSearch}
          style={{ marginLeft: 10, padding: '6px 12px' }}
        >
          Rechercher
        </button>
      </div>

      {loading && <p>Recherche en cours…</p>}

      {!loading && results.length > 0 && (
        <table
          style={{
            borderCollapse: 'collapse',
            width: '100%',
            maxWidth: 700,
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: 'left',
                  borderBottom: '2px solid #000',
                  padding: 6,
                }}
              >
                Fournisseur
              </th>
              <th
                style={{
                  textAlign: 'left',
                  borderBottom: '2px solid #000',
                  padding: 6,
                }}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.name}>
                <td style={{ padding: 6 }}>{r.name}</td>
                <td style={{ padding: 6 }}>
                  <a
                    href={r.searchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Voir chez le fournisseur
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && results.length === 0 && query && (
        <p>Aucun fournisseur trouvé</p>
      )}
    </main>
  )
}
