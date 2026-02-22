// components/ResultCard.tsx
import type { SupplierResult } from '../lib/types'

interface ResultCardProps {
  results: SupplierResult[]
  supplierLogo?: string // optionnel, chemin vers le logo du fournisseur
}

export default function ResultCard({ results, supplierLogo }: ResultCardProps) {
  if (results.length === 0) return null

  const supplierName = results[0].supplier

  return (
    <div className="flex-1 border rounded-lg shadow p-4">
      {/* Logo + nom du fournisseur */}
      <div className="flex flex-col items-center mb-4">
        {supplierLogo && (
          <img
            src={supplierLogo}
            alt={supplierName}
            className="h-16 w-auto mb-2"
          />
        )}
        <h2 className="text-xl font-semibold">{supplierName}</h2>
      </div>

      {/* Liste des produits */}
      <div className="flex flex-col gap-3">
        {results.map((item, idx) => (
          <div
            key={idx}
            className="border rounded-lg p-3 flex flex-col items-center bg-white shadow-sm hover:shadow-md transition"
          >
            {/* Image produit */}
            {item.image && (
              <img
                src={item.image}
                alt={item.designation || item.title}
                className="w-32 h-32 object-contain mb-2"
              />
            )}

            {/* Désignation */}
            <p className="font-medium text-center">{item.designation || item.title}</p>

            {/* Référence */}
            {item.reference && (
              <p className="text-sm text-gray-500">Ref: {item.reference}</p>
            )}

            {/* Stock */}
            {item.stock && (
              <p className="text-sm text-green-600 mt-1">{item.stock}</p>
            )}

            {/* Bouton lien */}
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition text-sm"
              >
                Voir le produit
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}