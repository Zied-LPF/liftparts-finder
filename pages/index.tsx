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
  const [query,setQuery]=useState("")
  const [file,setFile]=useState<File|null>(null)
  const [results,setResults]=useState<Result[]>([])
  const [loading,setLoading]=useState(false)

  const handleSearchText = async()=>{
    if(!query) return
    setLoading(true)
    try{
      const res=await fetch(`/api/search-suppliers?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data)
    }catch(err){}
    setLoading(false)
  }

  const handleSearchImage = async()=>{
    if(!file) return
    setLoading(true)
    try{
      const worker = await createWorker({ logger:m=>console.log(m) })
      await worker.load()
      await worker.loadLanguage("fra+eng")
      await worker.initialize("fra+eng")
      await worker.setParameters({ tessedit_pageseg_mode:PSM.SINGLE_BLOCK })
      const { data:{ text } } = await worker.recognize(file)
      await worker.terminate()
      const queryFromImage = text.trim()
      if(!queryFromImage){ setResults([]); setLoading(false); return }
      const res = await fetch(`/api/search-suppliers?q=${encodeURIComponent(queryFromImage)}`)
      const data = await res.json()
      setResults(data)
    }catch(err){}
    setLoading(false)
  }

  return (
    <div style={{ padding:40, fontFamily:"Arial, sans-serif" }}>
      <h1 style={{ fontSize:32, marginBottom:20 }}>LiftParts Finder</h1>

      <div style={{ marginBottom:20, display:"flex", gap:10 }}>
        <input type="text" value={query} onChange={e=>setQuery(e.target.value)}
          onKeyDown={e=>e.key==="Enter" && handleSearchText()}
          placeholder="Référence ou mot-clé..."
          style={{padding:10, width:300, fontSize:16, borderRadius:5, border:"1px solid #ccc"}}/>
        <button onClick={handleSearchText} style={{ padding:"10px 15px", borderRadius:5, background:"#0070f3", color:"#fff", border:"none", cursor:"pointer"}}>Rechercher</button>
      </div>

      <div style={{ marginBottom:20, display:"flex", gap:10, alignItems:"center" }}>
        <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} />
        <button onClick={handleSearchImage} style={{ padding:"10px 15px", borderRadius:5, background:"#0070f3", color:"#fff", border:"none", cursor:"pointer"}}>Recherche par image</button>
      </div>

      {loading && <p>Recherche en cours...</p>}

      <div style={{ marginTop:20, display:"flex", flexDirection:"column", gap:15 }}>
        {results.map((r,i)=>(
          <a key={i} href={r.link} target="_blank" rel="noopener noreferrer" style={{ display:"flex", alignItems:"center", gap:15, padding:10, border:"1px solid #eee", borderRadius:5, textDecoration:"none", color:"#000" }}>
            <img src={r.image||r.fallbackImage||"/no-image.png"} alt={r.title} style={{ width:60, height:60, objectFit:"contain", borderRadius:5, background:"#f5f5f5"}}/>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600, fontSize:16 }}>{r.title}</div>
              <div style={{ fontSize:14, color:"#555" }}>{r.supplier}</div>
            </div>
            <div style={{ fontSize:14, fontWeight:600, color:"#0070f3" }}>{r.score}</div>
          </a>
        ))}
      </div>

      {!loading && results.length===0 && (query||file) && <p>Aucun résultat trouvé</p>}
    </div>
  )
}
