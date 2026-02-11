import { useState } from 'react'
import Head from 'next/head'
import { SUPPLIERS, Supplier } from '../lib/suppliers'

type Part = {
  id: string
  name: string
  reference: string
  brand?: string
  supplier?: Supplier | null
  supplierPriority?: number
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Part[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data || [])
    } catch (err) {
      console.error('Search error', err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>LiftParts Finder</title>
      </Head>

      <main style={{ padding: 24 }}>
        <h1>LiftParts Finder</h1>

        {/* 🔍 Recherche */}
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            placeholder="Référence ou mot-clé"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            style={{ marginRight: 8 }}
          />
          <button onClick={handleSearch} disabled={loading}>
            {loading ? 'Recherche…' : 'Rechercher'}
          </button>
        </div>

        {/* 📋 Résultats */}
        {results.length === 0 && !loading && (
          <p>Aucune pièce trouvée</p>
        )}

        <ul>
          {results.map((part) => {
            const supplier = part.supplier

            const supplierLink =
              supplier?.baseUrl && supplier?.searchParam
                ? supplier.baseUrl +
                  '?' +
                  supplier.searchParam +
                  '=' +
                  encodeURIComponent(part.reference)
                : null

            return (
              <li
                key={part.id}
                style={{
                  marginBottom: 12,
                  padding: 12,
                  border: '1px solid #ccc',
                }}
              >
                <strong>{part.name}</strong>
                <div>Référence : {part.reference}</div>
                {part.brand && <div>Marque : {part.brand}</div>}

                {/* 🏷️ Fournisseur */}
                {supplier && (
                  <div style={{ marginTop: 6 }}>
                    Fournisseur :{' '}
                    <strong>
                      {supplier.name}
                      {supplier.favorite && ' ⭐'}
                    </strong>
                  </div>
                )}

                {/* 🔗 Lien fournisseur */}
                {supplierLink && (
                  <div>
                    <a
                      href={supplierLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Voir chez le fournisseur
                    </a>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </main>
    </>
  )
}
