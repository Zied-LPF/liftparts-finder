// pages/index.tsx
import { useState } from 'react'
import type { SupplierResult } from '../lib/types'

// Logos fournisseur
function getLogoForSupplier(supplier: string): string | undefined {
  switch (supplier) {
    case 'MySodimas':
      return '/logos/mysodimas.png'
    case 'MGTI':
      return '/logos/mgti.png'
    default:
      return undefined
  }
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SupplierResult[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!query) return
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data: SupplierResult[] = await res.json()
      setResults(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setResults([])
    }
    setLoading(false)
  }

  const groupedResults = results.reduce(
    (acc: Record<string, SupplierResult[]>, item) => {
      if (!acc[item.supplier]) acc[item.supplier] = []
      acc[item.supplier].push(item)
      return acc
    },
    {}
  )

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <img
            src="/logos/LiftParts-Finder.png"
            alt="LiftParts Finder"
            className="h-16 w-auto"
          />
        </div>
        <div className="w-full md:w-1/3 mt-4 md:mt-0">
          <div className="flex shadow-lg">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Rechercher par référence ou mot-clé"
              className="flex-1 px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-700 transition"
            >
              Rechercher
            </button>
          </div>
        </div>
      </header>

      {/* Loading */}
      {loading && (
        <p className="text-gray-500 animate-pulse text-center">Recherche en cours...</p>
      )}

      {/* Aucun résultat */}
      {!loading && results.length === 0 && query && (
        <p className="text-gray-500 text-center">Aucun résultat trouvé.</p>
      )}

      {/* Résultats par fournisseur */}
      {results.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {Object.entries(groupedResults).map(([supplier, items]) => (
            <div key={supplier} className="bg-white rounded-2xl shadow p-4 flex flex-col">
              {/* Logo et titre fournisseur */}
              <div className="flex flex-col items-center mb-4 border-b pb-2">
                {getLogoForSupplier(supplier) && (
                  <img src={getLogoForSupplier(supplier)} alt={supplier} className="h-16 w-auto mb-2" />
                )}
                <h2 className="text-xl font-bold">{supplier}</h2>
                <p className="text-gray-500 text-sm">{items.length} résultat(s)</p>
              </div>

              {/* Cartes produits */}
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 shadow-sm flex flex-col items-center hover:shadow-md transition">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.designation || item.title} // 🔹 corrigé label -> title
                        className="h-28 w-full object-contain mb-3"
                      />
                    )}
                    <p className="font-semibold text-center mb-1">{item.designation || item.title}</p> {/* 🔹 label -> title */}
                    {item.reference && <p className="text-gray-600 text-sm mb-1">Réf : {item.reference}</p>} {/* 🔹 ref -> reference */}
                    {item.stock && <p className="text-green-600 text-sm mb-2">Stock : {item.stock}</p>}
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition text-sm"
                      >
                        Voir le produit
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}