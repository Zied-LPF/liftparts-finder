import { useState } from 'react'
import Head from 'next/head'
import { Supplier } from '../lib/suppliers'

type Part = {
  id?: string
  name: string
  reference: string
  brand?: string
  supplier?: Supplier
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

      <main style={{ padding: 20, fontFamily: 'serif' }}>
        <h1>LiftParts Finder</h1>

        {/* Recherche */}
        <div style={{ marginBottom: 20 }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Référence ou mot-clé"
            style={{ marginRight: 8 }}
          />
          <button onClick={handleSearch}>Rechercher</button>
        </div>

        {/* Chargement */}
        {loading && <p>Recherche en cours…</p>}

        {/* Résultats */}
        {!loading && results.length === 0 && query && (
          <p>Aucune pièce trouvée</p>
        )}

        <ul>
          {results.map((part, index) => {
            const supplierLink =
              part.supplier && part.reference
                ? part.supplier.searchUrl +
                  encodeURIComponent(part.reference)
                : null

            return (
              <li key={index} style={{ marginBottom: 16 }}>
                <div
                  style={{
                    border: '1px solid #ccc',
                    padding: 12,
                    maxWidth: 500,
                  }}
                >
                  <strong>{part.name}</strong>
                  <br />
                  Référence : {part.reference}
                  <br />
                  {part.brand && <>Marque : {part.brand}<br /></>}
                  {part.supplier && (
                    <>
                      Fournisseur : {part.supplier.name}
                      <br />
                    </>
                  )}

                  {supplierLink && (
                    <a
                      href={supplierLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Voir chez le fournisseur
                    </a>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </main>
    </>
  )
}
