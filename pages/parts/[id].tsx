import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'

type Part = {
  id: string
  name: string
  reference: string
  brand?: string
  category?: string
  notes?: string
}

type PartImage = {
  id: string
  url: string
  isMain?: boolean
}

export default function PartPage() {
  const router = useRouter()
  const { id } = router.query

  const [part, setPart] = useState<Part | null>(null)
  const [images, setImages] = useState<PartImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const loadData = async () => {
    if (!id) return
    setLoading(true)

    const partRes = await fetch(`/api/part?id=${id}`)
    setPart(await partRes.json())

    const imgRes = await fetch(`/api/part-images?partId=${id}`)
    const imgData = await imgRes.json()
    setImages(Array.isArray(imgData) ? imgData : [])

    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [id])

  const setMainImage = async (imageId: string) => {
    await fetch('/api/set-main-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        partId: id,
        imageId,
      }),
    })

    await loadData()
  }

  if (loading) return <p style={{ padding: 24 }}>Chargement…</p>
  if (!part) return <p style={{ padding: 24 }}>Pièce introuvable</p>

  const mainImage = images.find(i => i.isMain)

  return (
    <main style={{ padding: 24, background: '#f4f6f8', minHeight: '100vh' }}>
      <Link href="/">← Retour</Link>

      <div style={{ background: '#fff', padding: 20, marginTop: 16 }}>
        <h1>{part.name}</h1>
        <p>{part.reference}</p>

        {/* IMAGE PRINCIPALE */}
        {mainImage && (
          <img
            src={mainImage.url}
            alt={part.name}
            style={{
              width: 300,
              height: 300,
              objectFit: 'contain',
              border: '1px solid #ccc',
              marginBottom: 20,
            }}
          />
        )}

        {/* GALERIE */}
        <h3>Photos</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {images.map(img => (
            <div key={img.id} style={{ textAlign: 'center' }}>
              <img
                src={img.url}
                alt=""
                style={{
                  width: 140,
                  height: 140,
                  objectFit: 'contain',
                  border: img.isMain ? '2px solid green' : '1px solid #ccc',
                }}
              />
              {!img.isMain && (
                <button
                  style={{ marginTop: 6, fontSize: 12 }}
                  onClick={() => setMainImage(img.id)}
                >
                  Définir comme principale
                </button>
              )}
              {img.isMain && (
                <div style={{ fontSize: 12, color: 'green' }}>
                  Image principale
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
