'use client'
import { useState } from "react"
import { createWorker, PSM } from "tesseract.js"

type Result = {
  supplier: string
  title: string
  description: string
  image: string | null
  fallbackImage: string
  link: string
  score: number
  exactMatch: boolean
}

export default function Home() {
  const [query, setQuery] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)
  const [log, setLog] = useState<string[]>([])

  const addLog = (msg: string) => setLog(prev => [msg, ...prev])

  const fetchResults = async (q: string) => {
    setLoading(true)
    addLog(`🔹 Recherche pour: ${q}`)
    try {
      const res = await fetch(`/api/search-suppliers?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      addLog(`🔹 API renvoie ${data.length} résultat(s)`)

      data.forEach((r: any, i: number) => {
        addLog(`   - ${i + 1}: ${r.title} [${r.supplier}] score:${r.score}`)
      })

      setResults(data)
    } catch (err) {
      addLog(`⚠️ Erreur fetch: ${err}`)
      setResults([])
    }
    setLoading(false)
  }

  const handleSearchText = async () => {
    if (!query) return
    await fetchResults(query)
  }

  const handleSearchImage = async () => {
    if (!file) return
    setLoading(true)
    addLog(`🔹 OCR image en cours: ${file.name}`)
    try {
      const worker = await createWorker({ logger: m => addLog(JSON.stringify(m)) })
      await worker.load()
      await worker.loadLanguage("fra+eng")
      await worker.initialize("fra+eng")
      await worker.setParameters({ tessedit_pageseg_mode: PSM.SINGLE_BLOCK })
      const { data: { text } } = await worker.recognize(file)
      await worker.terminate()
      const queryFromImage = text.trim()
      addLog(`🔹 Texte OCR: "${queryFromImage}"`)
      if (queryFromImage) await fetchResults(queryFromImage)
      else setResults([])
    } catch (err) {
      addLog(`⚠️ OCR error: ${err}`)
      setResults([])
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: 40, fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>LiftParts Finder</h1>

      <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearchText()}
          placeholder="Référence ou mot-clé..."
          style={{ padding: 10, width: 300, fontSize: 16, borderRadius: 5, border: "1px solid #ccc" }}
        />
        <button
          onClick={handleSearchText}
          style={{ padding: "10px 15px", borderRadius: 5, background: "#0070f3", color: "#fff", border: "none", cursor: "pointer" }}
        >
          Rechercher
        </button>
      </div>

      <div style={{ marginBottom: 20, display: "flex", gap: 10, alignItems: "center" }}>
        <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
        <button
          onClick={handleSearchImage}
          style={{ padding: "10px 15px", borderRadius: 5, background: "#0070f3", color: "#fff", border: "none", cursor: "pointer" }}
        >
          Recherche par image
        </button>
      </div>

      {loading && <p>Recherche en cours...</p>}

      <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 15 }}>
        {results.map((r, i) => (
          <a
            key={i}
            href={r.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 15, padding: 10, border: "1px solid #eee", borderRadius: 5, textDecoration: "none", color: "#000" }}
          >
            <img
              src={r.image || r.fallbackImage || "/no-image.png"}
              alt={r.title}
              style={{ width: 60, height: 60, objectFit: "contain", borderRadius: 5, background: "#f5f5f5" }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 16 }}>{r.title}</div>
              <div style={{ fontSize: 14, color: "#555" }}>{r.supplier}</div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#0070f3" }}>{r.score}</div>
          </a>
        ))}
        {!loading && results.length === 0 && (query || file) && <p>Aucun résultat trouvé</p>}
      </div>

      <div style={{ marginTop: 20, background: "#f0f0f0", padding: 10, borderRadius: 5 }}>
        <h3>Logs Debug</h3>
        <div style={{ maxHeight: 300, overflowY: "auto", fontFamily: "monospace", fontSize: 14 }}>
          {log.map((l, i) => <div key={i}>{l}</div>)}
        </div>
      </div>
    </div>
  )
}
