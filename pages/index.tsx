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

  const search = async () => {
    const res = await fetch(
      `/api/search?q=${encodeURIComponent(query)}&favoriteSupplier=${encodeURIComponent(
        favoriteSupplier
      )}`
    )
    const data = await res.json()
    setResults(data)
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>LiftParts Finder</h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Référence ou mot-clé"
      />

      <select
        value={favoriteSupplier}
        onChange={(e) => setFavoriteSupplier(e.target.value)}
        style={{ marginLeft: 10 }}
      >
        <option value="Sodimas">Sodimas</option>
        <option value="Otis">Otis</option>
        <option value="Kone">Kone</option>
        <option value="Schindler">Schindler</option>
      </select>

      <button onClick={search} style={{ marginLeft: 10 }}>
        Rechercher
      </button>

      <ul>
        {results.map((part) => (
          <li key={part.id} style={{ marginTop: 15 }}>
            <strong>{part.name}</strong>
            <br />
            Référence : {part.reference}
            <br />
            Marque : {part.brand}
            <br />
            Fournisseur : {part.supplier?.name}
            <br />
            {part.supplier?.baseUrl && (
              <a
                href={
                  part.supplier.baseUrl +
                  encodeURIComponent(part.reference)
                }
                target="_blank"
              >
                Voir chez le fournisseur
              </a>
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}
