import { useState } from 'react'
import Head from 'next/head'
import { Supplier } from '../lib/suppliers'

type Part = {
  id: string
  name: string
  reference: string
  brand?: string
  supplier?: Supplier | null
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
    } catch (e) {
      console.error(e)
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

        <div style={{ marginBottom: 16 }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Référence ou mot-clé"
          />
          <button onClick={handleSearch} disabled={loading}>
            Rechercher
          </button>
        </div>

        {!loading && results.length === 0 && <p>Aucune pièce trouvée</p>}

        <ul>
          {results.map((part) => {
            const supplier = part.supplier

            const supplierLink = supplier
              ? `${supplier.baseUrl}?q=${encodeURIComponent(part.reference)}`
              : null

            return (
              <li
                key={part.id}
                style={{ border: '1px solid #ccc', padding: 12, marginBottom: 12 }}
              >
                <strong>{part.name}</strong>
                <div>Référence : {part.reference}</div>
                {part.brand && <div>Marque : {part.brand}</div>}

                {supplier && (
                  <div>
                    Fournisseur : <strong>{supplier.name}</strong>
                    {supplier.favorite && ' ⭐'}
                  </div>
                )}

                {supplierLink && (
                  <div>
                    <a href={supplierLink} target="_blank" rel="noreferrer">
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
