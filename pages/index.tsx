// pages/index.tsx
import { useState } from "react"

type SupplierResult = {
  supplier: string
  title: string
  reference: string
  link: string
  image: string | null
  fallbackImage: string
  score: number
  exactMatch: boolean
  fromGoogle: boolean
}

export default function Home() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SupplierResult[]>([])
  const [loading, setLoading] = useState(false)
  const [debugLogs, setDebugLogs] = useState<string[]>([])

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setResults([])
    setDebugLogs((logs) => [...logs, `🔹 Recherche pour: ${query}`])

    try {
      const res = await fetch(`/api/search-suppliers?q=${encodeURIComponent(query)}`)
      const data: SupplierResult[] = await res.json()
      setResults(data)
      setDebugLogs((logs) => [...logs, `🔹 API renvoie ${data.length} résultat(s)`])
    } catch (err) {
      console.error(err)
      setDebugLogs((logs) => [...logs, `⚠ Erreur API`])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">LiftParts Finder</h1>

      {/* Barre de recherche */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Recherche"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="border rounded-l-lg px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-r-lg"
        >
          {loading ? "…" : "Rechercher"}
        </button>
      </div>

      {/* Résultats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.length === 0 && !loading && (
          <div className="col-span-full text-center text-gray-500">
            Aucun résultat trouvé
          </div>
        )}

        {results.map((r, i) => (
          <a
            key={i}
            href={r.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-200 flex flex-col"
          >
            <div className="h-40 w-full bg-gray-200 flex items-center justify-center">
              <img
                src={r.image || r.fallbackImage}
                alt={r.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <h2 className="font-semibold text-lg mb-2">{r.title}</h2>
              <div className="flex justify-between items-center">
                <span
                  className={`px-2 py-1 text-xs rounded-full font-semibold ${
                    r.fromGoogle ? "bg-yellow-200 text-yellow-800" : "bg-blue-200 text-blue-800"
                  }`}
                >
                  {r.fromGoogle ? "Google" : r.supplier}
                </span>
                <span className="text-xs text-gray-500">{r.score} pts</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Logs Debug */}
      <div className="mt-6 max-h-60 overflow-y-auto p-2 bg-gray-50 border rounded">
        {debugLogs.map((log, i) => (
          <div key={i} className="text-xs text-gray-700">
            {log}
          </div>
        ))}
      </div>
    </div>
  )
}
