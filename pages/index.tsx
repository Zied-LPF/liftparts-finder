import { useState } from 'react'

type Result = {
  supplier: string
  title: string
  reference: string
  image?: string
  link: string
  searched: string
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])

  const search = async () => {
    if (!query.trim()) return

    const res = await fetch(`/api/search-suppliers?q=${encodeURIComponent(query)}`)
    const data = await res.json()
    setResults(data)
  }

  return (
    <main>
      {/* VISUEL INCHANGÉ */}

      <div className="results">
        {results.map((r) => (
          <div key={r.supplier} className="card">
            <h2>{r.supplier}</h2>

            {r.image && (
              <img
                src={r.image}
                alt={r.title}
                style={{ maxWidth: '100%', maxHeight: 160, objectFit: 'contain' }}
              />
            )}

            <p><strong>Résultats disponibles chez ce fournisseur</strong></p>
            <p><strong>Référence :</strong> {r.reference}</p>
            <p><strong>Recherche :</strong> {r.searched}</p>

            <a href={r.link} target="_blank">
              <button>Voir chez {r.supplier}</button>
            </a>
          </div>
        ))}
      </div>
    </main>
  )
}
