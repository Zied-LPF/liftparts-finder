import { useState } from 'react'

type SearchResult = {
  id: string
  name: string
  reference?: string
  brand?: string
  supplier?: string
  supplierUrl?: string
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!searchTerm.trim()) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`)
      const data = await res.json()
      setResults(data || [])
    } catch (err) {
      setError('Erreur lors de la recherche')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>LiftParts Finder</h1>

      {/* Champ de recherche */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={searchTerm}
          placeholder="Référence, mot-clé, marque…"
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch()
            }
          }}
          style={{ marginRight: 8, width: 260 }}
        />

        <button onClick={handleSearch}>Rechercher</button>
      </div>

      {/* États */}
      {loading && <p>Recherche en cours…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && results.length === 0 && searchTerm && (
        <p>Aucune pièce trouvée</p>
      )}

      {/* Résultats */}
      <ul>
        {results.map((item) => (
          <li key={item.id} style={{ marginBottom: 12 }}>
            <strong>{item.name}</strong>
            {item.reference && <div>Référence : {item.reference}</div>}
            {item.brand && <div>Marque : {item.brand}</div>}
            {item.supplier && <div>Fournisseur : {item.supplier}</div>}

            {item.supplierUrl && (
              <a
                href={item.supplierUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Voir chez le fournisseur
              </a>
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}
