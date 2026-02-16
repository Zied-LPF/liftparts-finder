// pages/index.tsx
"use client"

import Search from "../components/Search"


export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>LiftParts Finder</h1>
      <p>Rechercher des pièces par référence, marque ou fournisseur.</p>

      <Search />
    </main>
  )
}
