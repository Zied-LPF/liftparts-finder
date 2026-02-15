'use client'
import { useState } from "react"

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
  const [results,setResults]=useState<Result[]>([])
  const [loading,setLoading]=useState(false)
  const [log,setLog] = useState<string[]>([])

  const addLog = (msg:string) => setLog(prev => [...prev, msg])

  const handleSearchText = async()=>{
    if(!query) return
    setLoading(true)
    addLog(`🔹 Recherche pour: ${query}`)
    try{
      const res = await fetch(`/api/search-suppliers?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      addLog(`🔹 API renvoie ${data.length} résultat(s)`)
      data.forEach((r:any,i:number)=>{
        addLog(`   - ${i+1}: ${r.title} [${r.supplier}] score:${r.score}`)
      })
      setResults(data)
    }catch(err){
      addLog(`⚠️ Erreur fetch: ${err}`)
    }
    setLoading(false)
  }

  return (
    <div style={{ padding:40, fontFamily:"Arial, sans-serif" }}>
      <h1>LiftParts Finder - Debug Client</h1>

      <div style={{ marginBottom:20 }}>
        <input type="text" value={query} onChange={e=>setQuery(e.target.value)}
          onKeyDown={e=>e.key==="Enter" && handleSearchText()}
          placeholder="Référence ou mot-clé..."
          style={{padding:10,width:300,fontSize:16}}/>
        <button onClick={handleSearchText} style={{marginLeft:10,padding:"10px 15px"}}>Rechercher</button>
      </div>

      {loading && <p>Recherche en cours...</p>}

      <div style={{ marginTop:20 }}>
        <h3>Résultats</h3>
        {results.map((r,i)=>(
          <div key={i} style={{ marginTop:10 }}>
            <strong>{r.title}</strong> | {r.supplier} | score: {r.score} <br/>
            <a href={r.link} target="_blank" rel="noopener noreferrer">Voir produit</a>
          </div>
        ))}
        {results.length===0 && !loading && query && <p>Aucun résultat trouvé</p>}
      </div>

      <div style={{ marginTop:20, background:"#f0f0f0", padding:10 }}>
        <h3>Logs Debug</h3>
        <div style={{ maxHeight:300, overflowY:"auto", fontFamily:"monospace", fontSize:14 }}>
          {log.map((l,i)=><div key={i}>{l}</div>)}
        </div>
      </div>
    </div>
  )
}
