"use client"

import React from "react"

interface SearchProps {
  query: string
  setQuery: (q: string) => void
  handleSearch: () => void
  loading: boolean
}

export default function Search({ query, setQuery, handleSearch, loading }: SearchProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch()
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-2xl flex rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-white/40 dark:border-gray-700">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Rechercher une référence..."
          className="flex-1 px-6 py-4 bg-transparent focus:outline-none text-gray-800 dark:text-white placeholder-gray-500"
        />

        <button
          onClick={handleSearch}
          className="px-8 font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition"
        >
          {loading ? "Recherche..." : "Rechercher"}
        </button>
      </div>
    </div>
  )
}