// pages/index.tsx
"use client"

import { useState } from "react"
import type { SupplierResult } from "../lib/types"

// Logos fournisseur
function getLogoForSupplier(supplier: string): string | undefined {
  switch (supplier) {
    case "MySodimas":
      return "/logos/mysodimas.png"
    case "MGTI":
      return "/logos/mgti.png"
    default:
      return undefined
  }
}

export default function Home() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SupplierResult[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!query) return

    setLoading(true)
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`
      )
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
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col items-center gap-6">

          <img
            src="/logos/LiftParts-Finder.png"
            alt="LiftParts Finder"
            className="h-14 w-auto"
          />

          {/* Barre centrée et limitée */}
          <div className="w-full max-w-2xl flex">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Rechercher une référence..."
              className="flex-1 px-5 py-3 border border-gray-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-6 rounded-r-xl hover:bg-blue-700 transition font-medium"
            >
              Rechercher
            </button>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-6xl mx-auto px-6 py-10">

        {loading && (
          <p className="text-center text-gray-500 animate-pulse">
            Recherche en cours...
          </p>
        )}

        {!loading && results.length === 0 && query && (
          <p className="text-center text-gray-500">
            Aucun résultat trouvé.
          </p>
        )}

        {Object.entries(groupedResults).map(([supplier, items]) => (
          <div key={supplier} className="mb-14">

            {/* Supplier logo uniquement */}
            <div className="flex items-center gap-4 mb-6">
              {getLogoForSupplier(supplier) && (
                <img
                  src={getLogoForSupplier(supplier)}
                  alt={supplier}
                  className="h-10"
                />
              )}
              <span className="text-gray-500 text-sm">
                {items.length} résultat(s)
              </span>
            </div>

            {/* GRID RESPONSIVE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

              {items.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition duration-300 flex flex-col p-5"
                >

                  {/* IMAGE */}
                  <div className="h-36 flex items-center justify-center bg-gray-50 rounded-xl mb-4">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.designation || item.title}
                        className="max-h-28 object-contain transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="text-xs text-gray-400">
                        Pas d'image
                      </div>
                    )}
                  </div>

                  {/* INFOS */}
                  <div className="flex flex-col flex-1">

                    <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2">
                      {item.designation || item.title}
                    </h3>

                    {item.reference && (
                      <p className="text-xs text-gray-500 mb-1">
                        Réf : <span className="font-mono">{item.reference}</span>
                      </p>
                    )}

                    {item.stock && (
                      <p className="text-xs text-green-600 font-medium mb-2">
                        {item.stock}
                      </p>
                    )}

                    {/* Nom fournisseur déplacé ici */}
                    <p className="text-xs text-gray-400 mb-4">
                      Fournisseur : {supplier}
                    </p>

                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto text-center bg-blue-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
                      >
                        Voir le produit
                      </a>
                    )}
                  </div>

                </div>
              ))}

            </div>
          </div>
        ))}

      </main>
    </div>
  )
}