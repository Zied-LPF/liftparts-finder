"use client"

import { useState } from "react"

export type Part = {
  id: string
  name: string
  reference: string
  brand: string
  category: string | null
  notes: string | null
  favorite_supplier_id: string
  created_at: string
  is_favorite: boolean
  images: string[] | null
  link: string
  supplier: string
  title: string
  price: number
}

export default function Search() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Part[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!query) return
    setLoading(true)

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      if (Array.isArray(data.results)) {
        setResults(data.results)
      } else {
        setResults([])
      }
    } catch (error) {
      console.error("Erreur recherche:", error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1rem",
    marginTop: "1rem",
  }

  const cardStyle: React.CSSProperties = {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "1rem",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Rechercher une pièce..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{ padding: "0.5rem", width: "100%", borderRadius: "5px", border: "1px solid #ccc" }}
      />
      <button onClick={handleSearch} style={{ marginTop: "0.5rem", padding: "0.5rem 1rem" }}>
        {loading ? "Recherche..." : "Rechercher"}
      </button>

      <div style={gridStyle}>
        {results.length === 0 && !loading && <p>Aucun résultat</p>}
        {results.map((part) => (
          <a key={part.id} href={part.link} target="_blank" rel="noopener noreferrer" style={cardStyle}>
            <h3>{part.title}</h3>
            <p>
              <strong>Référence :</strong> {part.reference}<br />
              <strong>Marque :</strong> {part.brand}<br />
              <strong>Fournisseur :</strong> {part.supplier}<br />
              <strong>Prix :</strong> €{part.price}
            </p>
            {part.images && part.images.length > 0 && (
              <img src={part.images[0]} alt={part.title} style={{ width: "100%", borderRadius: "4px" }} />
            )}
          </a>
        ))}
      </div>
    </div>
  )
}
