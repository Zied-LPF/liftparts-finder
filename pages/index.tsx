import { useState } from 'react'

type Supplier = {
  name: string
  baseUrl: string
}

type Part = {
  id: string
  name: string
  reference: string
  brand: string
  supplier?: Supplier | null
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [favoriteSupplier, setFavoriteSupplier] = useState('Sodimas')
  const [results, setResults] = useState<Part[]>([])
  const [loading, setLoading] = useState(false)

  const search = async () => {
    if (!query.trim()) return
    setLoading(true)

    const res = await fetch(
      `/api/search?q=${encodeURIComponent(query)}&favoriteSupplier=${encodeURIComponent(
        favoriteSupplier
      )}`
    )
    const data = await res.json()
    setResults(data)
    setLoading(false)
  }

  return (
    <main
      style={{
        maxWidth: 900,
        margin: '0 auto',
        padding: 24,
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1 style={{ fontSize: 36, marginBottom: 20 }}>
        LiftParts Finder
      </h1>

      {/* 🔎 BARRE DE RECHERCHE */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          marginBottom: 30,
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Référence ou mot-clé (ex: LCB)"
          style={{
            flex: 1,
            padding: 10,
            fontSize: 16,
          }}
        />

        <select
          value={favoriteSupplier}
          onChange={(e) => setFavoriteSupplier(e.target.value)}
          style={{
            padding: 10,
            fontSize: 14,
          }}
        >
          <option value="Sodimas">Sodimas</option>
          <option value="Otis">Otis</option>
          <option value="Kone">Kone</option>
          <option value="Schindler">Schindler</option>
        </select>

        <button
          onClick={search}
          style={{
            padding: '10px 16px',
            fontSize: 16,
            cursor: 'pointer',
          }}
        >
          Rechercher
        </button>
      </div>

      {/* ⏳ LOADING */}
      {loading && <p>Recherche en cours…</p>}

      {/* 📦 RÉSULTATS */}
      {!loading && results.length === 0 && query && (
        <p>Aucune pièce trouvée</p>
      )}

      <div style={{ display: 'grid', gap: 16 }}>
        {results.map((part) => (
          <div
            key={part.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: 6,
              padding: 16,
              background: '#fafafa',
            }}
          >
            <strong style={{ fontSize: 18 }}>
              {part.name}
            </strong>

            <div style={{ marginTop: 6 }}>
              <div>Référence : {part.reference}</div>
              <div>Marque : {part.brand}</div>
              <div>Fournisseur : {part.supplier?.name}</div>
            </div>

            {part.supplier?.baseUrl && (
              <div style={{ marginTop: 10 }}>
                <a
                  href={
                    part.supplier.baseUrl +
                    encodeURIComponent(part.reference)
                  }
                  target="_blank"
                >
                  🔗 Voir chez le fournisseur
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}
