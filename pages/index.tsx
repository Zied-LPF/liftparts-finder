import { useState } from "react"

export default function Home() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])

  const handleSearch = async () => {
    if (!query) return

    const res = await fetch(`/api/search?q=${query}`)
    const data = await res.json()
    setResults(data)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          LiftParts Finder
        </h1>

        {/* Barre de recherche */}
        <div className="flex gap-2 mb-8">
          <input
            type="text"
            placeholder="Rechercher une pièce..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch()
            }}
            className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Rechercher
          </button>
        </div>

        {/* Résultats */}
        <div>
          {results.length === 0 && (
            <p className="text-center text-gray-500">
              Aucun résultat pour le moment.
            </p>
          )}

          {results.map((result, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-xl p-5 mb-4 border hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">
                  {result.supplier}
                </h2>
              </div>

              <p className="text-gray-900 font-medium mb-1">
                {result.name}
              </p>

              {result.brand && (
                <span className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full mb-3">
                  {result.brand}
                </span>
              )}

              <div>
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Voir chez fournisseur
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
