import { useEffect, useState } from 'react'

export default function Settings() {
  const [favoriteSupplier, setFavoriteSupplier] = useState('')

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setFavoriteSupplier(data.favorite_supplier))
  }, [])

  const saveFavorite = async (value: string) => {
    setFavoriteSupplier(value)
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ favorite_supplier: value }),
    })
  }

  return (
    <div>
      <h2>Fournisseur favori</h2>

      <select
        value={favoriteSupplier}
        onChange={e => saveFavorite(e.target.value)}
      >
        <option value="">— Aucun —</option>
        <option value="MySodimas">MySodimas</option>
        <option value="Otis">Otis</option>
        <option value="KONE">KONE</option>
        <option value="Schindler">Schindler</option>
      </select>
    </div>
  )
}
