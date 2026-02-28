"use client"

import { useState, useMemo } from "react"
import type { SupplierResult } from "../lib/types"
import Search from "../components/Search"

function getLogoForSupplier(supplier: string): string | undefined {
  switch (supplier) {
    case "MySodimas":
      return "/logos/mysodimas.png"
    case "MGTI":
      return "/logos/mgti.png"
    case "ElevatorShop":
      return "/logos/elevatorshop.png"  // ✅ nouveau logo ajouté
    default:
      return undefined
  }
}

export default function Home() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SupplierResult[]>([])
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState("pertinence")
  const [darkMode, setDarkMode] = useState(false)
  const [activeSupplier, setActiveSupplier] = useState("") // ✅ fournisseur actif

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

  const sortedResults = useMemo(() => {
    let sorted = [...results]

    if (sortBy === "az") {
      sorted.sort((a, b) =>
        (a.designation || a.title || "").localeCompare(
          b.designation || b.title || ""
        )
      )
    }

    if (sortBy === "stock") {
      sorted.sort((a, b) => (b.stock ? 1 : 0) - (a.stock ? 1 : 0))
    }

    return sorted
  }, [results, sortBy])

  const groupedResults = sortedResults.reduce(
    (acc: Record<string, SupplierResult[]>, item) => {
      if (!acc[item.supplier]) acc[item.supplier] = []
      acc[item.supplier].push(item)
      return acc
    },
    {}
  )

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">

        {/* ================= HEADER ================= */}
        <header className="relative overflow-hidden">

          {/* DARK MODE TOGGLE */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="absolute top-6 right-6 z-50"
          >
            <div className="relative w-14 h-8 flex items-center 
                            bg-white/70 dark:bg-gray-800/70 
                            backdrop-blur-xl 
                            border border-white/40 dark:border-gray-700 
                            rounded-full shadow-md transition">

              <span className="absolute left-2 text-xs">☀️</span>
              <span className="absolute right-2 text-xs">🌙</span>

              <div
                className={`absolute top-1 left-1 w-6 h-6 
                            bg-white dark:bg-gray-900 
                            rounded-full shadow-md 
                            transform transition-transform duration-300
                            ${darkMode ? "translate-x-6" : "translate-x-0"}`}
              />
            </div>
          </button>

          {/* IMAGE DE FOND */}
          <div
            className="absolute inset-0 bg-cover bg-right"
            style={{ backgroundImage: "url('/bg-elevator-lines.png')" }}
          />
          <div className="absolute inset-0 bg-black/10 dark:bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r 
            from-white/60 via-white/40 to-transparent 
            dark:from-gray-900/80 dark:via-gray-900/60 dark:to-transparent" />

          {/* CONTENU */}
          <div className="relative max-w-6xl mx-auto px-6 py-16 flex flex-col items-center">

            {/* TOP ROW */}
            <div className="w-full h-12 flex items-center justify-between mb-12">
              <img
                src="/logos/LiftParts-Finder.png"
                alt="LiftParts Finder"
                className="h-52 w-auto"
              />
            </div>

            {/* ======= RECHERCHE AVEC Search.tsx ======= */}
            <Search
              query={query}
              setQuery={setQuery}
              handleSearch={handleSearch}
              loading={loading}
            />

            {/* TRI */}
            {results.length > 0 && (
              <div className="w-full max-w-2xl mt-6 flex justify-end">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm px-4 py-2 rounded-xl backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border border-white/40 dark:border-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="pertinence">Pertinence</option>
                  <option value="stock">En stock d'abord</option>
                  <option value="az">A → Z</option>
                </select>
              </div>
            )}

          </div>
        </header>

        {/* ================= CONTENT ================= */}
        <main className="max-w-6xl mx-auto px-6 py-12">

          {loading && (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600"></div>
            </div>
          )}

          {!loading && results.length === 0 && query && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Aucun résultat trouvé.
            </p>
          )}

         {/* ==== BOUTONS FILTRE FOURNISSEUR ==== */}
{Object.keys(groupedResults).length > 0 && (
  <div className="flex flex-wrap gap-4 mb-8 justify-center">
    <button
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-sm border ${
        !activeSupplier
          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-700 hover:from-blue-700 hover:to-indigo-700 shadow-md"
          : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
      onClick={() => setActiveSupplier("")}
    >
      Tous ({results.length})
    </button>

    {Object.entries(groupedResults).map(([supplier, items]) => (
      <button
        key={supplier}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-sm border ${
          activeSupplier === supplier
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-700 hover:from-blue-700 hover:to-indigo-700 shadow-md"
            : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
        onClick={() => setActiveSupplier(supplier)}
      >
        {getLogoForSupplier(supplier) && (
          <img src={getLogoForSupplier(supplier)} alt={supplier} className="h-6" />
        )}
        <span>{supplier} ({items.length})</span>
      </button>
    ))}
  </div>
)}

          {/* ==== RESULTATS ==== */}
          {Object.entries(groupedResults)
            .filter(([supplier]) => !activeSupplier || activeSupplier === supplier)
            .map(([supplier, items]) => (
              <div key={supplier} className="mb-16">

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col p-6 border border-gray-100 dark:border-gray-700"
                    >

                      <div className="h-44 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-xl mb-5">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.designation || item.title}
                            className="max-h-32 object-contain transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : (
                          <div className="text-xs text-gray-400">
                            Pas d'image
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col flex-1">

                        <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3 line-clamp-2">
                          {item.designation || item.title}
                        </h3>

                        {item.reference && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Réf : <span className="font-mono">{item.reference}</span>
                          </p>
                        )}

                        {item.stock && (
                          <p className="text-xs text-green-600 font-medium mb-3">
                            {item.stock}
                          </p>
                        )}

                        <div className="mb-5">
                          <span className="inline-block text-xs px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium">
                            {supplier}
                          </span>
                        </div>

                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-auto text-center py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition"
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
    </div>
  )
}