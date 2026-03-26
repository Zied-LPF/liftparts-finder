"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import type { SupplierResult } from "../lib/types"

// ─── Logo SVG ────────────────────────────────────────────────────────────────
const LPFLogo = ({ height = 44 }: { height?: number }) => (
  <svg viewBox="0 0 500 280" xmlns="http://www.w3.org/2000/svg" style={{ height, width: "auto" }}>
    <defs>
      <linearGradient id="ogh" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#fb923c" /><stop offset="100%" stopColor="#ea6a0a" />
      </linearGradient>
      <linearGradient id="bgcardh" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1a1f2e" /><stop offset="100%" stopColor="#0d1018" />
      </linearGradient>
      <filter id="glogh" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="sglogh" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <rect x="10" y="10" width="480" height="260" rx="18" fill="url(#bgcardh)" stroke="#f97316" strokeWidth="0.6" strokeOpacity="0.25" />
    <g stroke="#ffffff" strokeOpacity="0.025" strokeWidth="1">
      <line x1="10" y1="55" x2="490" y2="55" /><line x1="10" y1="100" x2="490" y2="100" />
      <line x1="10" y1="145" x2="490" y2="145" /><line x1="10" y1="190" x2="490" y2="190" />
      <line x1="10" y1="235" x2="490" y2="235" /><line x1="70" y1="10" x2="70" y2="270" />
      <line x1="140" y1="10" x2="140" y2="270" /><line x1="210" y1="10" x2="210" y2="270" />
      <line x1="280" y1="10" x2="280" y2="270" /><line x1="350" y1="10" x2="350" y2="270" />
      <line x1="420" y1="10" x2="420" y2="270" />
    </g>
    <rect x="36" y="36" width="4" height="180" rx="2" fill="#2a3040" />
    <rect x="78" y="36" width="4" height="180" rx="2" fill="#2a3040" />
    <g fill="#1e2530">
      <rect x="34" y="56" width="8" height="4" rx="1" /><rect x="34" y="80" width="8" height="4" rx="1" />
      <rect x="34" y="104" width="8" height="4" rx="1" /><rect x="34" y="128" width="8" height="4" rx="1" />
      <rect x="34" y="152" width="8" height="4" rx="1" /><rect x="76" y="56" width="8" height="4" rx="1" />
      <rect x="76" y="80" width="8" height="4" rx="1" /><rect x="76" y="104" width="8" height="4" rx="1" />
      <rect x="76" y="128" width="8" height="4" rx="1" /><rect x="76" y="152" width="8" height="4" rx="1" />
    </g>
    <rect x="40" y="72" width="40" height="52" rx="4" fill="#1e2840" stroke="#f97316" strokeWidth="1.5" filter="url(#glogh)" />
    <line x1="60" y1="76" x2="60" y2="120" stroke="#f97316" strokeWidth="0.8" strokeOpacity="0.6" />
    <rect x="40" y="72" width="40" height="6" rx="2" fill="#f97316" opacity="0.9" />
    <rect x="46" y="84" width="12" height="10" rx="2" fill="#0d1018" stroke="#f97316" strokeWidth="0.8" strokeOpacity="0.5" />
    <rect x="62" y="84" width="12" height="10" rx="2" fill="#0d1018" stroke="#f97316" strokeWidth="0.8" strokeOpacity="0.5" />
    <circle cx="50" cy="104" r="1.5" fill="#f97316" opacity="0.9" />
    <line x1="50" y1="40" x2="50" y2="72" stroke="#8b92a8" strokeWidth="1" strokeOpacity="0.5" />
    <line x1="55" y1="40" x2="55" y2="72" stroke="#8b92a8" strokeWidth="1" strokeOpacity="0.5" />
    <line x1="62" y1="40" x2="62" y2="72" stroke="#8b92a8" strokeWidth="1" strokeOpacity="0.5" />
    <g fill="#f97316" opacity="0.7" filter="url(#glogh)">
      <polygon points="59,46 64,56 54,56" /><polygon points="59,38 64,48 54,48" opacity="0.4" />
    </g>
    <g stroke="#2a3040" strokeWidth="1">
      <line x1="32" y1="126" x2="86" y2="126" /><line x1="32" y1="172" x2="86" y2="172" />
      <line x1="32" y1="218" x2="86" y2="218" />
    </g>
    <g fontFamily="Arial" fontSize="7" fill="#3a4050" textAnchor="middle">
      <text x="28" y="130">3</text><text x="28" y="176">2</text><text x="28" y="222">1</text>
    </g>
    <g transform="translate(100,58)" opacity="0.55">
      <circle r="11" fill="none" stroke="#f97316" strokeWidth="1.5" />
      <circle r="5" fill="none" stroke="#f97316" strokeWidth="1" />
      <g fill="#f97316">
        <rect x="-2" y="-13" width="4" height="5" rx="1" /><rect x="-2" y="8" width="4" height="5" rx="1" />
        <rect x="8" y="-2" width="5" height="4" rx="1" /><rect x="-13" y="-2" width="5" height="4" rx="1" />
      </g>
    </g>
    <g transform="translate(106,155)" opacity="0.4">
      <rect x="-4" y="-10" width="8" height="20" rx="3" fill="none" stroke="#8b92a8" strokeWidth="1.2" />
      <line x1="-6" y1="-4" x2="6" y2="-4" stroke="#8b92a8" strokeWidth="1.2" />
      <line x1="-6" y1="0" x2="6" y2="0" stroke="#8b92a8" strokeWidth="1.2" />
    </g>
    <g transform="translate(100,195)" opacity="0.35">
      <circle r="8" fill="none" stroke="#f97316" strokeWidth="1.2" />
      <circle r="3.5" fill="none" stroke="#f97316" strokeWidth="0.8" />
      <g fill="#f97316">
        <rect x="-1.5" y="-10" width="3" height="4" rx="1" /><rect x="-1.5" y="6" width="3" height="4" rx="1" />
        <rect x="6" y="-1.5" width="4" height="3" rx="1" /><rect x="-10" y="-1.5" width="4" height="3" rx="1" />
      </g>
    </g>
    <text x="252" y="122" fontFamily="'Arial Black','Arial',sans-serif" fontSize="96" fontWeight="900" letterSpacing="2" textAnchor="middle" fill="url(#ogh)" filter="url(#sglogh)">LPF</text>
    <g transform="translate(432,72)" filter="url(#glogh)">
      <circle r="26" fill="#0d1018" fillOpacity="0.55" stroke="#f97316" strokeWidth="2" />
      <circle r="21" fill="#f97316" fillOpacity="0.04" />
      <rect x="-6" y="-17" width="1.8" height="24" rx="1" fill="#2a3040" />
      <rect x="5" y="-17" width="1.8" height="24" rx="1" fill="#2a3040" />
      <rect x="-5.5" y="-12" width="12" height="14" rx="2" fill="#1e2840" stroke="#f97316" strokeWidth="0.8" />
      <rect x="-5.5" y="-12" width="12" height="3" rx="1" fill="#f97316" opacity="0.9" />
      <line x1="0" y1="-9" x2="0" y2="2" stroke="#f97316" strokeWidth="0.5" strokeOpacity="0.5" />
      <line x1="-22" y1="-4" x2="22" y2="-4" stroke="#f97316" strokeWidth="0.5" strokeOpacity="0.25" strokeDasharray="2,3" />
      <line x1="-22" y1="2" x2="22" y2="2" stroke="#f97316" strokeWidth="0.5" strokeOpacity="0.18" strokeDasharray="2,3" />
      <g stroke="#f97316" strokeWidth="1" strokeOpacity="0.55" fill="none">
        <path d="M-18,-18 L-18,-12 M-18,-18 L-12,-18" /><path d="M18,-18 L18,-12 M18,-18 L12,-18" />
        <path d="M-18,18 L-18,12 M-18,18 L-12,18" /><path d="M18,18 L18,12 M18,18 L12,18" />
      </g>
      <circle cx="13" cy="-14" r="1.5" fill="#fb923c" opacity="0.9" />
      <circle cx="17" cy="-9" r="1" fill="#fb923c" opacity="0.6" />
      <line x1="19" y1="19" x2="32" y2="32" stroke="#f97316" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="19" y1="19" x2="32" y2="32" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </g>
    <line x1="120" y1="134" x2="450" y2="134" stroke="url(#ogh)" strokeWidth="2" strokeLinecap="round" />
    <circle cx="120" cy="134" r="2.5" fill="#fb923c" />
    <circle cx="450" cy="134" r="2.5" fill="#ea6a0a" />
    <text x="285" y="155" fontFamily="'Arial',sans-serif" fontSize="15.5" fontWeight="700" letterSpacing="9.5" textAnchor="middle" fill="#f0f2f7" opacity="0.92">LIFTPARTS FINDER</text>
    <text x="285" y="175" fontFamily="'Arial',sans-serif" fontSize="8.5" letterSpacing="3.5" textAnchor="middle" fill="#8b92a8" opacity="0.7">INTELLIGENT PARTS SEARCH</text>
    <circle cx="26" cy="26" r="2" fill="#f97316" opacity="0.3" />
    <circle cx="474" cy="26" r="2" fill="#f97316" opacity="0.3" />
    <circle cx="26" cy="254" r="2" fill="#f97316" opacity="0.3" />
    <circle cx="474" cy="254" r="2" fill="#f97316" opacity="0.3" />
  </svg>
)

// ─── Helpers ─────────────────────────────────────────────────────────────────
const SUPPLIERS = ["mysodimas", "elvacenter", "elevatorshop", "donati", "sodica", "mgti", "kone", "hissmekano", "liftshop"]

const SUPPLIER_COLORS: Record<string, string> = {
  mysodimas: "#f97316", elvacenter: "#3b82f6", elevatorshop: "#22c55e",
  donati: "#a855f7", sodica: "#ec4899", mgti: "#14b8a6", kone: "#f59e0b",
  hissmekano: "#06b6d4", liftshop: "#10b981", google: "#ea4335", default: "#6b7280"
}

function normalize(s: string) { return s.toLowerCase().replace(/\s/g, "") }

function getLogoForSupplier(supplier: string): string | undefined {
  const map: Record<string, string> = {
    MySodimas: "/logos/mysodimas.png", ElevatorShop: "/logos/elevatorshop.png",
    Elvacenter: "/logos/elvacenter.png", Sodica: "/logos/sodica.png",
    MGTI: "/logos/mgti.png", KONE: "/logos/kone.png", Donati: "/logos/donati.png",
    Hissmekano: "/logos/hissmekano.png", LiftShop: "/logos/liftshop.png"
  }
  return map[supplier]
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Home() {
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SupplierResult[]>([])
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState("pertinence")
  const [activeSupplier, setActiveSupplier] = useState("")
  const [currentView, setCurrentView] = useState<"grid" | "list">("grid")
  const [pageSuppliers, setPageSuppliers] = useState<Record<string, number>>({})
  const [hasMoreSuppliers, setHasMoreSuppliers] = useState<Record<string, boolean>>({})
  const [loadingSuppliers, setLoadingSuppliers] = useState<Record<string, boolean>>({})
  const [zoomImage, setZoomImage] = useState<string | null>(null)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [googleResults, setGoogleResults] = useState<SupplierResult[]>([])
  const [googleLoading, setGoogleLoading] = useState(false)

  // Auth
  useEffect(() => {
    const check = () => setLoggedIn(document.cookie.includes("lpf_auth=1"))
    check()
    router.events.on("routeChangeComplete", check)
    return () => router.events.off("routeChangeComplete", check)
  }, [router.events])

  useEffect(() => {
    const handler = () => setLoggedIn(true)
    window.addEventListener("lpf_login", handler)
    return () => window.removeEventListener("lpf_login", handler)
  }, [])

  // History
  useEffect(() => {
    try { setSearchHistory(JSON.parse(localStorage.getItem("lpf_history") || "[]")) } catch {}
  }, [])

  const addHistory = useCallback((q: string) => {
    const h = [q, ...searchHistory.filter(x => x !== q)].slice(0, 6)
    setSearchHistory(h)
    localStorage.setItem("lpf_history", JSON.stringify(h))
  }, [searchHistory])

  const handleLogout = () => {
    document.cookie = "lpf_auth=; Path=/; Max-Age=0;"
    setLoggedIn(false)
    router.push("/login")
  }

  // Search
  const handleSearch = async () => {
    if (!query || !loggedIn) return
    setLoading(true)
    setResults([])
    setGoogleResults([])
    setPageSuppliers({})
    setHasMoreSuppliers({})
    setLoadingSuppliers({})
    setActiveSupplier("")
    setHasSearched(true)
    addHistory(query)

    const promises = SUPPLIERS.map(async (supplier) => {
      setLoadingSuppliers(prev => ({ ...prev, [supplier]: true }))
      try {
        const res = await fetch(`/api/search-${supplier}?query=${encodeURIComponent(query)}&page=1`)
        const data: { results: SupplierResult[]; hasMore: boolean } = await res.json()
        setResults(prev => [...prev, ...(Array.isArray(data.results) ? data.results : [])])
        setPageSuppliers(prev => ({ ...prev, [supplier]: 1 }))
        setHasMoreSuppliers(prev => ({ ...prev, [supplier]: data.hasMore }))
      } catch (err) { console.error(`Erreur ${supplier}`, err) }
      setLoadingSuppliers(prev => ({ ...prev, [supplier]: false }))
    })
    await Promise.all(promises)
    setLoading(false)

    // Fallback Google : si aucun résultat trouvé chez les fournisseurs
    setResults(prev => {
      if (prev.length === 0) {
        setGoogleLoading(true)
        fetch(`/api/search-google?query=${encodeURIComponent(query)}&page=1`)
          .then(r => r.json())
          .then((data: { results: SupplierResult[]; hasMore: boolean }) => {
            setGoogleResults(Array.isArray(data.results) ? data.results : [])
          })
          .catch(err => console.error("Google fallback error:", err))
          .finally(() => setGoogleLoading(false))
      }
      return prev
    })
  }

  const loadMore = async (supplier: string) => {
    if (!query || !hasMoreSuppliers[supplier]) return
    setLoadingSuppliers(prev => ({ ...prev, [supplier]: true }))
    try {
      const nextPage = (pageSuppliers[supplier] || 1) + 1
      const res = await fetch(`/api/search-${supplier}?query=${encodeURIComponent(query)}&page=${nextPage}`)
      const data: { results: SupplierResult[]; hasMore: boolean } = await res.json()
      setResults(prev => [...prev, ...(Array.isArray(data.results) ? data.results : [])])
      setPageSuppliers(prev => ({ ...prev, [supplier]: nextPage }))
      setHasMoreSuppliers(prev => ({ ...prev, [supplier]: data.hasMore }))
    } catch (err) { console.error(err) }
    setLoadingSuppliers(prev => ({ ...prev, [supplier]: false }))
  }

  const resetSearch = () => {
    setQuery(""); setResults([]); setActiveSupplier(""); setHasSearched(false)
    setPageSuppliers({}); setHasMoreSuppliers({}); setLoadingSuppliers({})
  }

  // Sort & filter
  const sortedResults = useMemo(() => {
    let sorted = [...results]
    if (sortBy === "az") sorted.sort((a, b) => (a.designation || a.title || "").localeCompare(b.designation || b.title || ""))
    if (sortBy === "stock") sorted.sort((a, b) => (b.stock ? 1 : 0) - (a.stock ? 1 : 0))
    return sorted
  }, [results, sortBy])

  const filteredResults = useMemo(() =>
    activeSupplier ? sortedResults.filter(r => normalize(r.supplier) === activeSupplier) : sortedResults
  , [sortedResults, activeSupplier])

  const groupedResults = useMemo(() =>
    filteredResults.reduce((acc: Record<string, SupplierResult[]>, item) => {
      if (!acc[item.supplier]) acc[item.supplier] = []
      acc[item.supplier].push(item)
      return acc
    }, {})
  , [filteredResults])

  const allGrouped = useMemo(() =>
    results.reduce((acc: Record<string, SupplierResult[]>, item) => {
      if (!acc[item.supplier]) acc[item.supplier] = []
      acc[item.supplier].push(item)
      return acc
    }, {})
  , [results])

  const inStockCount = results.filter(r => r.stock && !/backorder/i.test(r.stock)).length

  // ─── Theme colors ──────────────────────────────────────────────────────────
  const T = darkMode ? {
    bg: "#0a0b0d", bg2: "#111318", bg3: "#181c24", bg4: "#1e2330",
    border: "rgba(255,255,255,0.07)", border2: "rgba(255,255,255,0.13)",
    text: "#f0f2f7", text2: "#8b92a8", text3: "#5a6070",
  } : {
    bg: "#f4f5f7", bg2: "#ffffff", bg3: "#eef0f4", bg4: "#e4e7ef",
    border: "rgba(0,0,0,0.07)", border2: "rgba(0,0,0,0.13)",
    text: "#0f1117", text2: "#52596e", text3: "#9aa0b0",
  }

  // ─── Styles ────────────────────────────────────────────────────────────────
  const S = {
    page: { minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "'DM Sans', sans-serif", transition: "background .25s, color .25s" } as React.CSSProperties,
    topbar: { position: "sticky" as const, top: 0, zIndex: 100, height: 60, background: darkMode ? "rgba(10,11,13,0.95)" : "rgba(244,245,247,0.95)", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", padding: "0 24px", gap: 20, backdropFilter: "blur(12px)" },
    btn: (active = false) => ({ padding: "7px 16px", height: 36, background: active ? "rgba(249,115,22,0.12)" : T.bg3, border: `1px solid ${active ? "rgba(249,115,22,0.3)" : T.border}`, borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", color: active ? "#f97316" : T.text2, transition: "all .2s", fontFamily: "'DM Sans', sans-serif" } as React.CSSProperties),
    hero: { padding: hasSearched ? "24px 24px 16px" : "48px 24px 36px", textAlign: "center" as const, transition: "padding .3s" },
    searchRow: { display: "flex", gap: 10, background: T.bg2, border: `1px solid ${T.border2}`, borderRadius: 14, padding: 6, boxShadow: "0 4px 24px rgba(0,0,0,0.2)", maxWidth: 680, margin: "0 auto" },
    searchInput: { flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: T.text, padding: "10px 0" } as React.CSSProperties,
    searchBtn: { padding: "10px 24px", background: "#f97316", color: "#fff", border: "none", borderRadius: 10, fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" as const },
    statsBar: { display: "flex", alignItems: "center", borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: "0 24px", background: T.bg2, overflowX: "auto" as const },
    statItem: { display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", whiteSpace: "nowrap" as const, borderRight: `1px solid ${T.border}`, fontSize: 13, color: T.text2 },
    statNum: { fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: T.text },
    layout: { display: "flex", maxWidth: 1400, width: "100%", margin: "0 auto", padding: "0 24px" },
    sidebar: { width: 260, flexShrink: 0, padding: "24px 20px", borderRight: `1px solid ${T.border}`, position: "sticky" as const, top: 60, height: "calc(100vh - 60px)", overflowY: "auto" as const },
    sidebarTitle: { fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: T.text3, marginBottom: 12 },
    supBtn: (active: boolean) => ({ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, border: active ? "1px solid rgba(249,115,22,0.3)" : `1px solid transparent`, background: active ? "rgba(249,115,22,0.1)" : "transparent", cursor: "pointer", textAlign: "left" as const, width: "100%", color: active ? "#f97316" : T.text2, fontSize: 13, transition: "all .15s", fontFamily: "'DM Sans', sans-serif" }),
    content: { flex: 1, padding: 24, minWidth: 0 },
    card: { background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column" as const, cursor: "pointer", transition: "border-color .2s, box-shadow .2s, transform .2s" },
    cardImgWrap: { height: 180, background: T.bg3, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" },
    cardBody: { padding: 16, flex: 1, display: "flex", flexDirection: "column" as const, gap: 7 },
    badge: (type: "stock" | "backorder" | "supplier") => {
      const map = { stock: { bg: "rgba(34,197,94,0.1)", color: "#22c55e" }, backorder: { bg: "rgba(245,158,11,0.1)", color: "#f59e0b" }, supplier: { bg: T.bg4, color: T.text2 } }
      return { padding: "3px 8px", borderRadius: 100, fontSize: 11, fontWeight: 500, background: map[type].bg, color: map[type].color } as React.CSSProperties
    },
    link: { display: "block", textAlign: "center" as const, padding: 10, background: T.bg3, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12, fontWeight: 500, color: T.text2, textDecoration: "none", marginTop: "auto", transition: "all .2s" },
    listItem: { background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 16, transition: "border-color .2s", cursor: "pointer" },
    select: { padding: "7px 12px", borderRadius: 8, background: T.bg3, border: `1px solid ${T.border}`, color: T.text, fontSize: 13, cursor: "pointer", outline: "none", fontFamily: "'DM Sans', sans-serif" } as React.CSSProperties,
    viewBtn: (active: boolean) => ({ width: 32, height: 32, borderRadius: 7, background: active ? "rgba(249,115,22,0.1)" : T.bg3, border: `1px solid ${active ? "rgba(249,115,22,0.3)" : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14, color: active ? "#f97316" : T.text2 } as React.CSSProperties),
  }

  const StockBadge = ({ stock }: { stock?: string }) => {
    if (!stock) return null
    const isBackorder = /backorder/i.test(stock)
    return <span style={S.badge(isBackorder ? "backorder" : "stock")}>{isBackorder ? "Backorder" : stock}</span>
  }

  const PartCard = ({ item }: { item: SupplierResult }) => {
    const title = item.designation || item.title || "Sans désignation"
    return (
      <div style={S.card} onClick={() => item.image && setZoomImage(item.image)}>
        <div style={S.cardImgWrap}>
          {item.image
            ? <img src={item.image} alt={title} style={{ maxHeight: 140, maxWidth: "90%", objectFit: "contain" }} onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
            : <span style={{ fontSize: 12, color: T.text3 }}>Pas d'image</span>}
        </div>
        <div style={S.cardBody}>
          <p style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4, color: T.text }}>{title}</p>
          {item.reference && <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: T.text3 }}>Réf: {item.reference}</p>}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const, marginTop: 2 }}>
            <StockBadge stock={item.stock} />
            <span style={S.badge("supplier")}>{item.supplier}</span>
          </div>
          {item.link && (
            <a href={item.link} target="_blank" rel="noopener noreferrer" style={S.link} onClick={e => e.stopPropagation()}>
              Voir le produit →
            </a>
          )}
        </div>
      </div>
    )
  }

  const ListItem = ({ item }: { item: SupplierResult }) => {
    const title = item.designation || item.title || "Sans désignation"
    return (
      <div style={S.listItem} onClick={() => item.image && setZoomImage(item.image)}>
        <div style={{ width: 72, height: 72, flexShrink: 0, background: T.bg3, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {item.image
            ? <img src={item.image} alt={title} style={{ maxWidth: 62, maxHeight: 62, objectFit: "contain" }} onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
            : <span style={{ fontSize: 18, opacity: 0.2 }}>🔩</span>}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, color: T.text }}>{title}</p>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" as const }}>
            {item.reference && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: T.text3 }}>Réf: {item.reference}</span>}
            <StockBadge stock={item.stock} />
            <span style={S.badge("supplier")}>{item.supplier}</span>
          </div>
        </div>
        {item.link && (
          <a href={item.link} target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{ padding: "7px 14px", borderRadius: 8, background: T.bg3, border: `1px solid ${T.border}`, fontSize: 12, color: T.text2, textDecoration: "none", whiteSpace: "nowrap" as const, flexShrink: 0 }}>
            Voir le produit →
          </a>
        )}
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>LiftParts Finder</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </Head>

      <div style={S.page}>

        {/* ── TOPBAR ── */}
        <header style={S.topbar} id="topbar">
          <a href="#" onClick={e => { e.preventDefault(); resetSearch() }} style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <LPFLogo height={38} />
          </a>
          <div style={{ flex: 1 }} />
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{ ...S.btn(), width: 36, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}
            title="Changer de thème"
          >
            {darkMode ? "🌙" : "☀️"}
          </button>
          <button style={S.btn()} onClick={loggedIn ? handleLogout : () => router.push("/login")}>
            {loggedIn ? "Déconnexion" : "Connexion"}
          </button>
        </header>

        {/* ── HERO ── */}
        <section style={S.hero} id="heroSection">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <LPFLogo height={220} />
          </div>
          <p style={{ fontSize: 14, color: "#8b92a8", marginBottom: 24 }}>
            Agrégateur multi-fournisseurs — Elvacenter, Donati, ElevatorShop, Sodica, MGTI & plus
          </p>

          {/* Search bar */}
          <div style={S.searchRow} id="searchRow">
            <span style={{ display: "flex", alignItems: "center", padding: "0 12px 0 10px", color: "#5a6070", fontSize: 18 }}>🔍</span>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder={loggedIn ? "Référence, marque ou désignation..." : "Connectez-vous pour rechercher..."}
              disabled={!loggedIn}
              style={{ ...S.searchInput, opacity: loggedIn ? 1 : 0.5 }}
            />
            <button onClick={handleSearch} disabled={!loggedIn || loading} style={{ ...S.searchBtn, opacity: (!loggedIn || loading) ? 0.5 : 1, cursor: (!loggedIn || loading) ? "not-allowed" : "pointer" }}>
              {loading ? "Recherche…" : "Rechercher"}
            </button>
          </div>

          {!loggedIn && (
            <p style={{ color: "#ef4444", fontSize: 13, marginTop: 10 }}>
              Veuillez vous <a href="/login" style={{ color: "#f97316" }}>connecter</a> pour utiliser la recherche.
            </p>
          )}

          {/* History pills */}
          {searchHistory.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 14 }}>
              {searchHistory.map(h => (
                <button key={h} onClick={() => { setQuery(h); setTimeout(handleSearch, 0) }}
                  style={{ padding: "4px 12px", borderRadius: 100, background: "#181c24", border: "1px solid rgba(255,255,255,0.07)", fontSize: 12, color: "#8b92a8", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  ↺ {h}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* ── STATS BAR ── */}
        {hasSearched && (
          <div style={S.statsBar} id="statsBar">
            <div style={S.statItem}>
              <span style={S.statNum}>{results.length}</span>
              <span>résultats</span>
            </div>
            <div style={S.statItem}>
              <span style={S.statNum}>{Object.keys(allGrouped).length}</span>
              <span>fournisseurs</span>
            </div>
            {inStockCount > 0 && (
              <div style={S.statItem}>
                <span style={{ ...S.statNum, color: "#22c55e" }}>{inStockCount}</span>
                <span>en stock</span>
              </div>
            )}
            <div style={{ marginLeft: "auto", padding: "0 0 0 20px", display: "flex", alignItems: "center", gap: 10 }}>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={S.select}>
                <option value="pertinence">Pertinence</option>
                <option value="stock">En stock d'abord</option>
                <option value="az">A → Z</option>
              </select>
              <div style={{ display: "flex", gap: 4 }}>
                <button style={S.viewBtn(currentView === "grid")} onClick={() => setCurrentView("grid")}>⊞</button>
                <button style={S.viewBtn(currentView === "list")} onClick={() => setCurrentView("list")}>☰</button>
              </div>
            </div>
          </div>
        )}

        {/* ── MAIN LAYOUT ── */}
        {hasSearched && (
          <div style={S.layout} id="mainLayout">

            {/* Sidebar */}
            <aside style={S.sidebar}>
              <div style={{ padding: "0 16px" }}>
                <p style={S.sidebarTitle}>Fournisseurs</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <button style={S.supBtn(!activeSupplier)} onClick={() => setActiveSupplier("")}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#6b7280", flexShrink: 0 }} />
                    Tous
                    <span style={{ marginLeft: "auto", fontSize: 11, fontFamily: "'DM Mono', monospace", background: "#1e2330", padding: "2px 7px", borderRadius: 100 }}>{results.length}</span>
                  </button>
                  {Object.entries(allGrouped).map(([sup, items]) => {
                    const key = normalize(sup)
                    const color = SUPPLIER_COLORS[key] || SUPPLIER_COLORS.default
                    const isActive = activeSupplier === key
                    return (
                      <button key={sup} style={S.supBtn(isActive)} onClick={() => setActiveSupplier(isActive ? "" : key)}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
                        {sup}
                        <span style={{ marginLeft: "auto", fontSize: 11, fontFamily: "'DM Mono', monospace", background: "#1e2330", padding: "2px 7px", borderRadius: 100 }}>{items.length}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </aside>

            {/* Content */}
            <main style={S.content} id="contentArea">

              {loading && (
                <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid #1e2330", borderTopColor: "#f97316", animation: "spin .7s linear infinite" }} />
                </div>
              )}

              {!loading && results.length === 0 && hasSearched && (
                <div style={{ textAlign: "center", padding: "80px 40px" }}>
                  <div style={{ fontSize: 48, marginBottom: 16, opacity: .3 }}>🔩</div>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Aucun résultat</p>
                  <p style={{ fontSize: 14, color: "#8b92a8" }}>Essayez une autre référence ou un autre terme.</p>
                </div>
              )}

              {Object.entries(groupedResults).map(([supplier, items]) => {
                const key = normalize(supplier)
                const color = SUPPLIER_COLORS[key] || SUPPLIER_COLORS.default
                const logo = getLogoForSupplier(supplier)
                return (
                  <div key={supplier} style={{ marginBottom: 40 }}>
                    {/* Supplier header */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingBottom: 14, borderBottom: `1px solid ${T.border}` }}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />
                      {logo && <img src={logo} alt={supplier} style={{ height: 22, width: "auto", objectFit: "contain" }} />}
                      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700 }}>{supplier}</span>
                      <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", background: T.bg4, color: T.text2, padding: "3px 10px", borderRadius: 100 }}>{items.length} résultats</span>
                    </div>

                    {/* Grid or List */}
                    {currentView === "grid" ? (
                      <div className="results-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                        {items.map((item, i) => <PartCard key={i} item={item} />)}
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {items.map((item, i) => <ListItem key={i} item={item} />)}
                      </div>
                    )}

                    {/* Voir plus — sous les résultats */}
                    {hasMoreSuppliers[key] && (
                      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
                        <button onClick={() => loadMore(key)}
                          style={{ padding: "9px 28px", borderRadius: 8, background: T.bg3, border: `1px solid ${T.border}`, fontSize: 13, color: T.text2, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all .2s" }}>
                          {loadingSuppliers[key] ? "Chargement…" : "+ Voir plus"}
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}

              {/* ── GOOGLE FALLBACK ── */}
              {!loading && results.length === 0 && (googleLoading || googleResults.length > 0) && (
                <div style={{ marginBottom: 40 }}>
                  {/* Header Google */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingBottom: 14, borderBottom: `1px solid ${T.border}` }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ea4335", display: "inline-block", flexShrink: 0 }} />
                    <svg width="16" height="16" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700 }}>Google</span>
                    {googleLoading
                      ? <span style={{ fontSize: 12, color: T.text2 }}>Recherche en cours…</span>
                      : <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", background: T.bg4, color: T.text2, padding: "3px 10px", borderRadius: 100 }}>{googleResults.length} résultats</span>
                    }
                    <span style={{ fontSize: 11, color: T.text3, marginLeft: 4 }}>— Aucun résultat chez nos fournisseurs</span>
                  </div>

                  {googleLoading && (
                    <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", border: "3px solid #1e2330", borderTopColor: "#ea4335", animation: "spin .7s linear infinite" }} />
                    </div>
                  )}

                  {/* Résultats Google en liste */}
                  {!googleLoading && googleResults.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {googleResults.map((item, i) => (
                        <div key={i} style={{ ...S.listItem, cursor: "default" }}>
                          <div style={{ width: 56, height: 56, flexShrink: 0, background: T.bg3, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                            {item.image
                              ? <img src={item.image} alt={item.title} style={{ maxWidth: 48, maxHeight: 48, objectFit: "contain" }} onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
                              : <svg width="20" height="20" viewBox="0 0 24 24" opacity="0.3"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                            }
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 3, color: T.text }}>{item.title}</p>
                            <p style={{ fontSize: 11, color: T.text3, marginBottom: 0 }}>{item.source}</p>
                          </div>
                          <a href={item.link} target="_blank" rel="noopener noreferrer"
                            style={{ padding: "7px 14px", borderRadius: 8, background: T.bg3, border: `1px solid ${T.border}`, fontSize: 12, color: T.text2, textDecoration: "none", whiteSpace: "nowrap" as const, flexShrink: 0 }}>
                            Voir →
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </main>
          </div>
        )}

        {/* ── ZOOM MODAL ── */}
        {zoomImage && (
          <div onClick={() => setZoomImage(null)} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src={zoomImage} alt="Zoom" style={{ maxWidth: "90vw", maxHeight: "85vh", borderRadius: 12, objectFit: "contain" }} onClick={e => e.stopPropagation()} />
            <button onClick={() => setZoomImage(null)} style={{ position: "absolute", top: 20, right: 20, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", fontSize: 20, cursor: "pointer" }}>✕</button>
          </div>
        )}

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          ::-webkit-scrollbar { width: 6px; height: 6px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: ${T.bg4}; border-radius: 3px; }
          .part-card:hover { border-color: ${T.border2} !important; box-shadow: 0 8px 32px rgba(0,0,0,0.3); transform: translateY(-2px); }
          .list-item:hover { border-color: ${T.border2} !important; }
          .card-link:hover { background: #f97316 !important; border-color: #f97316 !important; color: #fff !important; }
          .load-more-btn:hover { border-color: rgba(249,115,22,0.3) !important; color: #f97316 !important; }

          /* ── MOBILE RESPONSIVE ── */
          @media (max-width: 768px) {
            /* Sidebar cachée sur mobile */
            aside { display: none !important; }

            /* Layout pleine largeur */
            #mainLayout { padding: 0 12px !important; }

            /* Hero compact */
            #heroSection { padding: 16px 12px 12px !important; }

            /* Logo plus petit sur mobile */
            #heroSection svg { height: 140px !important; }

            /* Search row full width */
            #searchRow { border-radius: 10px !important; }
            #searchRow input { font-size: 14px !important; }
            #searchRow button { padding: 8px 16px !important; font-size: 13px !important; }

            /* Stats bar scrollable */
            #statsBar { padding: 0 12px !important; }
            #statsBar > div { padding: 10px 12px !important; }

            /* Grille 2 colonnes sur mobile */
            .results-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }

            /* Cards plus compactes */
            .card-img { height: 120px !important; }
            .card-body { padding: 10px !important; }

            /* Content padding réduit */
            #contentArea { padding: 12px !important; }

            /* Supplier header wrap */
            .supplier-header { flex-wrap: wrap !important; gap: 8px !important; }

            /* Topbar compact */
            #topbar { padding: 0 12px !important; gap: 10px !important; }

            /* History pills */
            #historyRow { gap: 6px !important; }
            #historyRow button { font-size: 11px !important; padding: 3px 10px !important; }

            /* Liste view sur mobile */
            .list-item-img { width: 52px !important; height: 52px !important; }
            .list-item-actions { display: none !important; }
          }

          @media (max-width: 400px) {
            .results-grid { grid-template-columns: 1fr !important; }
            #heroSection svg { height: 110px !important; }
          }
        `}</style>
      </div>
    </>
  )
}
