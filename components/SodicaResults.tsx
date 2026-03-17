// components/SodicaResults.tsx
"use client"

import React from "react"
import type { SupplierResult } from "../lib/types"

type Props = {
  results: SupplierResult[]
}

export default function SodicaResults({ results }: Props) {
  if (!results.length) return <p>Aucun résultat Sodica.</p>

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {results.map((product) => (
        <div
          key={product.reference}
          className="border rounded-lg p-3 bg-white flex flex-col justify-between"
        >
          {/* Image avec lien vers le produit */}
          <a href={product.link} target="_blank" rel="noopener noreferrer" className="block mb-3">
            <img
              src={product.image}
              alt={product.designation}
              className="w-full h-auto max-h-64 object-contain rounded"
            />
          </a>

          {/* Titre du produit */}
          <h3 className="text-lg font-semibold mb-1">{product.designation}</h3>

          {/* Référence */}
          <p className="text-gray-500 uppercase mb-2">Réf: {product.reference}</p>

          {/* Bouton lien */}
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-block text-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Voir le produit
          </a>
        </div>
      ))}
    </div>
  )
}