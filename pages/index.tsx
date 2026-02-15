'use client'
import { useState } from 'react'
import { createWorker, PSM } from 'tesseract.js'

type Result = {
  supplier: string
  title: string
  description: string
  image: string | null
  fallbackImage: string
  link: string
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearchText = async () => {
    if (!query) return
    setLoading(true)
    try {
      const res = await fetch(`/api/search-suppliers?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchImage = async () => {
    if (!file) return
    setLoading(true)
    try {
      const worker = await createWorker({ logger: m => console.log(m) })
      await worker.load()
      await worker.loadLanguage('fra+eng')
      await worker.initialize('fra+eng')
      await worker.setParameters({ tessedit_pageseg_mode: PSM.SINGLE_BLOCK })

      const { data: { text } } = await worker.recognize(file)
      await worker.terminate()

      const queryFromImage = text.trim()
      if (!queryFromImage) { setResults([]); setLoading(false); return }

      const res = await fetch(`/api/search-suppliers?q=${encodeURIComponent(queryFromImage)}`)
      const data = await res.json()
      setResults(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>LiftParts Finder</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearchText()}
          placeholder="Référence ou mot-clé..."
          style={{ padding: 10, width: 300 }}
        />
        <button onClick={handleSearchText} style={{ marginLeft: 10 }}>Rechercher</button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
        <button onClick={handleSearchImage} style={{ marginLeft: 10 }}>Recherche par image</button>
      </div>

      {loading && <p>Recherche en cours...</p>}

      {results.map((r, i) => (
        <div key={i} style={{ marginTop: 20 }}>
          <h3>{r.supplier}</h3>
          <p>{r.title}</p>
          <a href={r.link} target="_blank" rel="noopener noreferrer">Voir produit</a>
        </div>
      ))}

      {!loading && results.length === 0 && (query || file) && <p>Aucun résultat trouvé</p>}
    </div>
  )
}
