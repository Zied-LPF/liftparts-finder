"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
// pages/index.tsx
const react_1 = require("react");
function Home() {
    const [query, setQuery] = (0, react_1.useState)("");
    const [results, setResults] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [logs, setLogs] = (0, react_1.useState)([]);
    const search = async () => {
        if (!query.trim())
            return;
        setLoading(true);
        setLogs((l) => [...l, `🔹 Recherche pour: ${query}`]);
        try {
            const res = await fetch(`/api/search-suppliers?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setResults(data);
            setLogs((l) => [...l, `🔹 API renvoie ${data.length} résultat(s)`]);
        }
        catch (err) {
            console.error(err);
            setLogs((l) => [...l, `🔹 Erreur API`]);
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">LiftParts Finder</h1>
      <div className="flex gap-2 mb-4">
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Entrez référence ou mot-clé" className="flex-1 p-2 border rounded"/>
        <button onClick={search} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Rechercher
        </button>
      </div>

      {loading && <div className="mb-4 text-gray-600">Recherche en cours...</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((r, i) => (<a key={i} href={r.link} target="_blank" rel="noopener noreferrer" className="bg-white shadow rounded overflow-hidden hover:shadow-lg transition">
            <img src={r.image || r.fallbackImage} alt={r.title} className="w-full h-48 object-contain bg-gray-100"/>
            <div className="p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{r.title}</span>
                <span className={`text-xs px-2 py-1 rounded ${r.fromGoogle ? "bg-yellow-300 text-yellow-900" : "bg-green-300 text-green-900"}`}>
                  {r.fromGoogle ? "Google" : r.supplier}
                </span>
              </div>
              <div className="text-sm text-gray-500">Score: {r.score}</div>
              {r.exactMatch && <div className="text-xs text-blue-600">Exact match</div>}
            </div>
          </a>))}
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Logs Debug</h2>
        <div className="bg-gray-200 p-3 rounded max-h-64 overflow-y-auto text-sm">
          {logs.map((l, i) => (<div key={i}>{l}</div>))}
        </div>
      </div>
    </div>);
}
