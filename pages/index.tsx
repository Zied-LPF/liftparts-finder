"use client"

import { useState, useMemo, useEffect, useCallback, useRef } from "react"
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
    <linearGradient id="ogl" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#fb923c" /><stop offset="100%" stopColor="#ea6a0a" />
    </linearGradient>
    <line x1="120" y1="134" x2="450" y2="134" stroke="url(#ogl)" strokeWidth="2" strokeLinecap="round" />
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

// ─── StockBadge ──────────────────────────────────────────────────────────────
function StockBadge({ stock }: { stock?: string }) {
  if (!stock) return null
  const inStock = !/backorder|out.of.stock|rupture/i.test(stock)
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 100,
      background: inStock ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
      color: inStock ? "#22c55e" : "#ef4444", letterSpacing: "0.04em"
    }}>
      {inStock ? "En stock" : "Rupture"}
    </span>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Home() {
  const router = useRouter()

  // ── Fix hydration : mounted guard ──────────────────────────────────────────
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  // ── États principaux ───────────────────────────────────────────────────────
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
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const [googleResults, setGoogleResults] = useState<SupplierResult[]>([])
  const [googleLoading, setGoogleLoading] = useState(false)

  // ── États recherche image ──────────────────────────────────────────────────
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageAnalysis, setImageAnalysis] = useState<any>(null)
  const [imageLoading, setImageLoading] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  // ── Auth ───────────────────────────────────────────────────────────────────
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

  // ── History ────────────────────────────────────────────────────────────────
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

  // ── Search ─────────────────────────────────────────────────────────────────
  const handleSearch = useCallback(async (overrideQuery?: string) => {
    const q = overrideQuery || query
    if (!q || !loggedIn) return
    setLoading(true)
    setResults([])
    setGoogleResults([])
    setPageSuppliers({})
    setHasMoreSuppliers({})
    setLoadingSuppliers({})
    setActiveSupplier("")
    setHasSearched(true)
    addHistory(q)

    await Promise.all(SUPPLIERS.map(async (supplier) => {
      setLoadingSuppliers(prev => ({ ...prev, [supplier]: true }))
      try {
        const res = await fetch(`/api/search-${supplier}?query=${encodeURIComponent(q)}&page=1`)
        const data: { results: SupplierResult[]; hasMore: boolean } = await res.json()
        setResults(prev => [...prev, ...(Array.isArray(data.results) ? data.results : [])])
        setHasMoreSuppliers(prev => ({ ...prev, [supplier]: data.hasMore }))
        setPageSuppliers(prev => ({ ...prev, [supplier]: 1 }))
      } catch (err) {
        console.error(`Search error for ${supplier}:`, err)
      } finally {
        setLoadingSuppliers(prev => ({ ...prev, [supplier]: false }))
      }
    }))

    setLoading(false)
  }, [query, loggedIn, addHistory])

  const loadMore = async (supplierSlug: string) => {
    const nextPage = (pageSuppliers[supplierSlug] || 1) + 1
    setLoadingSuppliers(prev => ({ ...prev, [supplierSlug]: true }))
    try {
      const res = await fetch(`/api/search-${supplierSlug}?query=${encodeURIComponent(query)}&page=${nextPage}`)
      const data: { results: SupplierResult[]; hasMore: boolean } = await res.json()
      setResults(prev => [...prev, ...(Array.isArray(data.results) ? data.results : [])])
      setHasMoreSuppliers(prev => ({ ...prev, [supplierSlug]: data.hasMore }))
      setPageSuppliers(prev => ({ ...prev, [supplierSlug]: nextPage }))
    } catch (err) {
      console.error(`Load more error for ${supplierSlug}:`, err)
    } finally {
      setLoadingSuppliers(prev => ({ ...prev, [supplierSlug]: false }))
    }
  }

  const resetSearch = () => {
    setQuery("")
    setResults([])
    setGoogleResults([])
    setHasSearched(false)
    setActiveSupplier("")
    resetImageSearch()
  }

  // ── Image search ───────────────────────────────────────────────────────────
  const handleImageSelect = async (f: globalThis.File) => {
    if (typeof window === "undefined") return
    if (!f.type.startsWith("image/")) {
      setImageError("Fichier non valide. Utilisez une image JPG, PNG ou WEBP.")
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      setImageError("Image trop lourde (max 10 MB)")
      return
    }
    setImageError(null)
    setImageAnalysis(null)
    const previewUrl = window.URL.createObjectURL(f)
    setImagePreview(previewUrl)
    setImageLoading(true)
    try {
      // Conversion base64 sans FileReader (compatible SSR)
      const arrayBuffer = await f.arrayBuffer()
      const bytes = new Uint8Array(arrayBuffer)
      let binary = ""
      for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i])
      const base64 = btoa(binary)

      const response = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mimeType: f.type })
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || "Erreur analyse")
      }
      const data = await response.json()
      setImageAnalysis(data)
      if (data.searchQuery) {
        setQuery(data.searchQuery)
        setTimeout(() => handleSearch(data.searchQuery), 100)
      }
    } catch (err: any) {
      setImageError(err.message || "Erreur lors de l'analyse")
    } finally {
      setImageLoading(false)
    }
  }

  const resetImageSearch = () => {
    if (typeof window !== "undefined" && imagePreview) window.URL.revokeObjectURL(imagePreview)
    setImagePreview(null)
    setImageAnalysis(null)
    setImageError(null)
    setImageLoading(false)
  }

  // ── Computed ───────────────────────────────────────────────────────────────
  const sortedResults = useMemo(() => {
    const sorted = [...results]
    if (sortBy === "az") sorted.sort((a, b) => a.title.localeCompare(b.title))
    else if (sortBy === "stock") sorted.sort((a, b) => (b.stock ? 1 : 0) - (a.stock ? 1 : 0))
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

  // ── Theme ──────────────────────────────────────────────────────────────────
  const T = darkMode ? {
    bg: "#0a0b0d", bg2: "#111318", bg3: "#181c24", bg4: "#1e2330",
    border: "rgba(255,255,255,0.07)", border2: "rgba(255,255,255,0.13)",
    text: "#f0f2f7", text2: "#8b92a8", text3: "#5a6070",
  } : {
    bg: "#f4f5f7", bg2: "#ffffff", bg3: "#eef0f4", bg4: "#e4e7ef",
    border: "rgba(0,0,0,0.07)", border2: "rgba(0,0,0,0.13)",
    text: "#0f1117", text2: "#52596e", text3: "#9aa0b0",
  }

  // ── Styles ─────────────────────────────────────────────────────────────────
  const S = {
    page: { minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "'DM Sans', sans-serif", transition: "background .25s, color .25s" } as React.CSSProperties,
    topbar: { position: "sticky" as const, top: 0, zIndex: 100, height: 60, background: darkMode ? "rgba(10,11,13,0.95)" : "rgba(244,245,247,0.95)", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", padding: "0 24px", gap: 20, backdropFilter: "blur(12px)" },
    btn: (active = false) => ({ padding: "7px 16px", height: 36, background: active ? "rgba(249,115,22,0.12)" : T.bg3, border: `1px solid ${active ? "rgba(249,115,22,0.3)" : T.border}`, borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", color: active ? "#f97316" : T.text2, transition: "all .2s", fontFamily: "'DM Sans', sans-serif" } as React.CSSProperties),
    hero: { padding: hasSearched ? "24px 24px 16px" : "48px 24px 36px", textAlign: "center" as const, transition: "padding .3s" },
    searchRow: { display: "flex", gap: 10, background: T.bg2, border: `1px solid ${T.border2}`, borderRadius: 14, padding: 6, boxShadow: "0 4px 24px rgba(0,0,0,0.2)", maxWidth: 680, margin: "0 auto" },
    searchInput: { flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: T.text, padding: "10px 0" } as React.CSSProperties,
    searchBtn: { padding: "10px 16px", background: "#f97316", color: "#fff", border: "none", borderRadius: 10, fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" as const },
    imageBar: { display: "flex", gap: 10, background: T.bg2, border: `1px solid ${T.border2}`, borderRadius: 14, padding: 6, boxShadow: "0 4px 24px rgba(0,0,0,0.2)", maxWidth: 680, margin: "4px auto 0", alignItems: "center" } as React.CSSProperties,
    imageBtn: { display: "flex", alignItems: "center", gap: 7, padding: "10px 16px", background: T.bg3, border: `1px solid ${T.border}`, borderRadius: 10, fontSize: 13, fontWeight: 500, color: T.text2, cursor: "pointer", whiteSpace: "nowrap" as const, fontFamily: "'DM Sans', sans-serif", transition: "all .2s", flexShrink: 0 } as React.CSSProperties,
    imagePreviewWrap: { flex: 1, display: "flex", alignItems: "center", gap: 10, minWidth: 0, padding: "0 4px" } as React.CSSProperties,
    statsBar: { display: "flex", alignItems: "center", borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: "0 24px", background: T.bg2, overflowX: "auto" as const },
    statItem: { display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", whiteSpace: "nowrap" as const, borderRight: `1px solid ${T.border}`, fontSize: 13, color: T.text2 },
    statNum: { fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: T.text },
    layout: { display: "flex", maxWidth: 1400, width: "100%", margin: "0 auto", padding: "0 24px" },
    sidebar: { width: 260, flexShrink: 0, padding: "24px 20px", borderRight: `1px solid ${T.border}`, position: "sticky" as const, top: 60, height: "calc(100vh - 60px)", overflowY: "auto" as const },
    sidebarTitle: { fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: T.text3, marginBottom: 12 },
    supBtn: (active: boolean) => ({ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, border: active ? "1px solid rgba(249,115,22,0.3)" : `1px solid transparent`, background: active ? "rgba(249,115,22,0.1)" : "transparent", cursor: "pointer", textAlign: "left" as const, width: "100%", color: active ? "#f97316" : T.text2, fontSize: 13, fontFamily: "'DM Sans', sans-serif", transition: "all .15s" } as React.CSSProperties),
    content: { flex: 1, padding: "24px 0 24px 32px", minWidth: 0 },
    card: { background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "border-color .2s, transform .15s", display: "flex", flexDirection: "column" as const },
    listItem: { background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", transition: "border-color .2s" },
    badge: (type: string) => ({ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 100, background: type === "supplier" ? T.bg4 : "rgba(249,115,22,0.1)", color: type === "supplier" ? T.text3 : "#f97316", letterSpacing: "0.04em" } as React.CSSProperties),
    select: { background: T.bg3, border: `1px solid ${T.border}`, borderRadius: 8, padding: "6px 10px", fontSize: 13, color: T.text2, outline: "none", fontFamily: "'DM Sans', sans-serif", cursor: "pointer" } as React.CSSProperties,
    mobileToolbar: { display: "none" },
  }

  // ── PartCard ───────────────────────────────────────────────────────────────
  function PartCard({ item }: { item: SupplierResult }) {
    const title = item.designation || item.title
    const key = normalize(item.supplier)
    const color = SUPPLIER_COLORS[key] || SUPPLIER_COLORS.default
    return (
      <div className="card-body" style={S.card}
        onClick={() => item.link && window.open(item.link, "_blank")}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = color; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)" }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = T.border; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)" }}>
        <div className="card-img" style={{ height: 160, background: T.bg3, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
          {item.image
            ? <img src={item.image} alt={title} style={{ width: "100%", height: "100%", objectFit: "contain" }}
                onClick={e => { e.stopPropagation(); setZoomImage(item.image!) }}
                onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
            : <span style={{ fontSize: 32, opacity: 0.15 }}>🔩</span>}
          <span style={{ position: "absolute", top: 8, right: 8, width: 8, height: 8, borderRadius: "50%", background: color }} />
        </div>
        <div style={{ padding: "14px 14px 12px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: T.text, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden", margin: 0 }}>{title}</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const, alignItems: "center" }}>
            {item.reference && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: T.text3 }}>Réf: {item.reference}</span>}
            <StockBadge stock={item.stock} />
          </div>
          <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={S.badge("supplier")}>{item.supplier}</span>
            {item.price && <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: "#f97316" }}>{item.price}€</span>}
          </div>
          {item.link && (
            <a href={item.link} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{ display: "block", textAlign: "center", padding: "7px", borderRadius: 8, background: T.bg3, border: `1px solid ${T.border}`, fontSize: 12, color: T.text2, textDecoration: "none", marginTop: 4 }}>
              Voir le produit →
            </a>
          )}
        </div>
      </div>
    )
  }

  // ── ListItem ───────────────────────────────────────────────────────────────
  function ListItem({ item }: { item: SupplierResult }) {
    const title = item.designation || item.title
    return (
      <div style={S.listItem}
        onClick={() => item.link && window.open(item.link, "_blank")}
        onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = T.border2}
        onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = T.border}>
        <div style={{ width: 56, height: 56, flexShrink: 0, background: T.bg3, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {item.image
            ? <img src={item.image} alt={title} style={{ maxWidth: 62, maxHeight: 62, objectFit: "contain" }} onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
            : <span style={{ fontSize: 18, opacity: 0.2 }}>🔩</span>}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, color: T.text, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>{title}</p>
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

  // ── Hydration guard ────────────────────────────────────────────────────────
  if (!mounted) return null

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <Head>
        <title>LiftParts Finder</title>
      </Head>

      <div style={S.page}>
        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

          @media (max-width: 640px) {
            #mainLayout { padding: 0 12px !important; }
            #heroSection { padding: 16px 12px 12px !important; }
            #heroSection svg { height: 140px !important; }
            #searchRow { border-radius: 10px !important; padding: 4px !important; }
            #searchRow input { font-size: 14px !important; }
            #searchRow button { padding: 8px 12px !important; font-size: 13px !important; border-radius: 8px !important; }
            #statsBar { padding: 0 12px !important; }
            #statsBar > div { padding: 10px 12px !important; }
            .results-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
            .card-img { height: 120px !important; }
            .card-body { padding: 10px !important; }
            #contentArea { padding: 12px !important; }
            .supplier-header { flex-wrap: wrap !important; gap: 8px !important; }
            #topbar { padding: 0 12px !important; gap: 10px !important; }
            #historyRow { gap: 6px !important; }
            #historyRow button { font-size: 11px !important; padding: 3px 10px !important; }
            #searchIcon { display: none !important; }
            #imageSearchBar { padding: 4px !important; gap: 6px !important; }
            #imageSearchBar button { padding: 8px 10px !important; font-size: 12px !important; gap: 4px !important; }
            #imageSearchBar button svg { width: 12px !important; height: 12px !important; }
            #imageSearchBar > div p { font-size: 11px !important; }
            aside { display: none !important; }
          }
          @media (max-width: 400px) {
            .results-grid { grid-template-columns: 1fr !important; }
            #heroSection svg { height: 110px !important; }
          }
        `}</style>

        {/* ── TOPBAR ── */}
        <header style={S.topbar} id="topbar">
          <a href="#" onClick={e => { e.preventDefault(); resetSearch() }} style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <img src="/logos/lpf-logo.png" alt="LPF" style={{ height: 38, width: "auto" }} />
          </a>
          <div style={{ flex: 1 }} />
          <button onClick={() => setDarkMode(!darkMode)}
            style={{ ...S.btn(), width: 36, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}
            title="Changer de thème">
            {darkMode ? "🌙" : "☀️"}
          </button>
          <button style={S.btn()} onClick={loggedIn ? handleLogout : () => router.push("/login")}>
            {loggedIn ? "Déconnexion" : "Connexion"}
          </button>
        </header>

        {/* ── HERO ── */}
        <section style={S.hero} id="heroSection">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <img src="/logos/lpf-logo.png" alt="LiftParts Finder" style={{ height: 220, width: "auto", maxWidth: "100%" }} />
          </div>
          <p style={{ fontSize: 14, color: "#8b92a8", marginBottom: 24 }}>
            Agrégateur multi-fournisseurs — Elvacenter, Donati, ElevatorShop, Sodica, MGTI & plus
          </p>

          {/* Barre recherche texte */}
          <div style={S.searchRow} id="searchRow">
            <span id="searchIcon" style={{ display: "flex", alignItems: "center", padding: "0 12px 0 10px", color: "#5a6070", fontSize: 18 }}>
              {loading
                ? <div style={{ width: 18, height: 18, border: "2.5px solid rgba(249,115,22,0.25)", borderTopColor: "#f97316", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
                : "🔍"}
            </span>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder={loading ? "Recherche en cours…" : loggedIn ? "Référence, marque ou désignation..." : "Connectez-vous pour rechercher..."}
              disabled={!loggedIn}
              style={{ ...S.searchInput, opacity: loggedIn ? 1 : 0.5 }}
            />
            <button onClick={() => handleSearch()} disabled={!loggedIn || loading}
              style={{ ...S.searchBtn, opacity: (!loggedIn || loading) ? 0.5 : 1, cursor: (!loggedIn || loading) ? "not-allowed" : "pointer" }}>
              {loading
                ? <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <div style={{ width: 13, height: 13, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
                    Recherche…
                  </span>
                : "Rechercher"}
            </button>
          </div>

          {!loggedIn && (
            <p style={{ color: "#ef4444", fontSize: 13, marginTop: 10 }}>
              Veuillez vous <a href="/login" style={{ color: "#f97316" }}>connecter</a> pour utiliser la recherche.
            </p>
          )}

          {/* Search wrapper avec autocomplete */}
          <div style={{ position: "relative", maxWidth: 680, margin: "0 auto" }}>
            {/* Dropdown autocomplete historique */}
            {searchHistory.length > 0 && query.length > 0 && (
              <div style={{
                position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 50,
                background: T.bg2, border: `1px solid ${T.border2}`,
                borderRadius: 12, overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)"
              }}>
                {searchHistory
                  .filter(h => h.toLowerCase().includes(query.toLowerCase()) && h !== query)
                  .slice(0, 5)
                  .map(h => (
                    <button key={h}
                      onClick={() => { setQuery(h); setTimeout(() => handleSearch(h), 0) }}
                      style={{
                        display: "flex", alignItems: "center", gap: 10, width: "100%",
                        padding: "10px 16px", background: "none", border: "none",
                        borderBottom: `1px solid ${T.border}`, color: T.text2,
                        fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                        textAlign: "left" as const
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = T.bg3)}
                      onMouseLeave={e => (e.currentTarget.style.background = "none")}
                    >
                      <span style={{ color: T.text3, fontSize: 12 }}>↺</span>
                      {h}
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* ── BARRE RECHERCHE PAR IMAGE (toujours visible) ── */}
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "6px 0 4px", opacity: 0.4 }}>
              <div style={{ flex: 1, height: 1, background: T.border }} />
              <span style={{ fontSize: 10, color: T.text3, letterSpacing: "0.1em", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase" as const }}>Recherche par image IA</span>
              <div style={{ flex: 1, height: 1, background: T.border }} />
            </div>

            <div style={S.imageBar} id="imageSearchBar">
              <input ref={imageInputRef} type="file" accept="image/*" style={{ display: "none" }}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleImageSelect(f); e.target.value = "" }} />
              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleImageSelect(f); e.target.value = "" }} />

              {/* Bouton Upload */}
              <button style={S.imageBtn} onClick={() => imageInputRef.current?.click()} disabled={imageLoading || !loggedIn}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Importer
              </button>

              {/* Zone centrale */}
              <div style={S.imagePreviewWrap}>
                {imageLoading && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: T.bg3, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 16, height: 16, border: `2px solid ${T.border2}`, borderTopColor: "#f97316", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, color: T.text, margin: 0, fontWeight: 500 }}>Analyse IA en cours…</p>
                      <p style={{ fontSize: 11, color: T.text3, margin: "2px 0 0" }}>Gemini 1.5 Pro identifie la pièce</p>
                    </div>
                  </div>
                )}
                {!imageLoading && imagePreview && imageAnalysis && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                    <img src={imagePreview} alt="pièce analysée"
                      style={{ width: 34, height: 34, borderRadius: 8, objectFit: "cover", flexShrink: 0, border: `1px solid ${T.border}` }} />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" as const, marginBottom: 3 }}>
                        {imageAnalysis.analysis?.brand && (
                          <span style={{ fontSize: 11, fontWeight: 600, color: "#f97316", background: "rgba(249,115,22,0.1)", padding: "2px 8px", borderRadius: 100, fontFamily: "'DM Mono', monospace" }}>
                            {imageAnalysis.analysis.brand}
                          </span>
                        )}
                        {imageAnalysis.analysis?.reference && (
                          <span style={{ fontSize: 11, color: T.text2, fontFamily: "'DM Mono', monospace", background: T.bg3, padding: "2px 8px", borderRadius: 100 }}>
                            {imageAnalysis.analysis.reference}
                          </span>
                        )}
                        <span style={{
                          fontSize: 11, padding: "2px 8px", borderRadius: 100,
                          background: imageAnalysis.analysis?.confidence === "high" ? "rgba(34,197,94,0.1)" : imageAnalysis.analysis?.confidence === "medium" ? "rgba(249,115,22,0.1)" : "rgba(107,114,128,0.1)",
                          color: imageAnalysis.analysis?.confidence === "high" ? "#22c55e" : imageAnalysis.analysis?.confidence === "medium" ? "#f97316" : T.text3
                        }}>
                          {imageAnalysis.analysis?.confidence === "high" ? "✓ Haute confiance" : imageAnalysis.analysis?.confidence === "medium" ? "~ Confiance moyenne" : "? Faible confiance"}
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: T.text2, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
                        {imageAnalysis.analysis?.partType} — {imageAnalysis.searchQuery}
                      </p>
                    </div>
                    <button onClick={resetImageSearch}
                      style={{ background: "none", border: "none", cursor: "pointer", color: T.text3, fontSize: 20, padding: 4, flexShrink: 0, lineHeight: 1 }}>×</button>
                  </div>
                )}
                {!imageLoading && !imagePreview && !imageError && (
                  <p style={{ flex: 1, textAlign: "center" as const, fontSize: 12, color: T.text3, margin: 0 }}>
                    <span className="img-bar-hint-long" style={{ display: "inline" }}>Importez ou photographiez une pièce — l'IA identifie la référence</span>
                    <style>{`@media(max-width:640px){.img-bar-hint-long{display:none!important}}`}</style>
                    <span className="img-bar-hint-short" style={{ display: "none" }}>Photo ou import — IA identifie la pièce</span>
                    <style>{`@media(max-width:640px){.img-bar-hint-short{display:inline!important}}`}</style>
                  </p>
                )}
                {!imageLoading && imageError && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                    <span style={{ fontSize: 12, color: "#ef4444" }}>⚠ {imageError}</span>
                    <button onClick={resetImageSearch} style={{ background: "none", border: "none", cursor: "pointer", color: T.text3, fontSize: 16 }}>×</button>
                  </div>
                )}
              </div>

              {/* Bouton Caméra */}
              <button style={{ ...S.imageBtn, background: "#f97316", color: "#fff", border: "none" }}
                onClick={() => cameraInputRef.current?.click()} disabled={imageLoading || !loggedIn}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 0 2-2l2-2h8l2 2a2 2 0 0 0 2 2h2a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                Caméra
              </button>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ── */}
        {hasSearched && (
          <>
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
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={S.select} id="desktopSort">
                  <option value="pertinence">Pertinence</option>
                  <option value="stock">En stock d'abord</option>
                  <option value="az">A → Z</option>
                </select>
                <button onClick={() => setCurrentView("grid")} style={{ ...S.btn(currentView === "grid"), width: 34, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="0" y="0" width="6" height="6" rx="1"/><rect x="10" y="0" width="6" height="6" rx="1"/><rect x="0" y="10" width="6" height="6" rx="1"/><rect x="10" y="10" width="6" height="6" rx="1"/></svg>
                </button>
                <button onClick={() => setCurrentView("list")} style={{ ...S.btn(currentView === "list"), width: 34, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="0" y="1" width="16" height="2" rx="1"/><rect x="0" y="7" width="16" height="2" rx="1"/><rect x="0" y="13" width="16" height="2" rx="1"/></svg>
                </button>
              </div>
            </div>

            {/* Mobile filter drawer */}
            {showMobileFilter && (
              <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.7)" }} onClick={() => setShowMobileFilter(false)}>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: T.bg2, borderRadius: "16px 16px 0 0", padding: "20px 16px 32px" }} onClick={e => e.stopPropagation()}>
                  <p style={S.sidebarTitle}>Fournisseurs</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <button style={S.supBtn(!activeSupplier)} onClick={() => { setActiveSupplier(""); setShowMobileFilter(false) }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#6b7280", flexShrink: 0 }} />
                      Tous
                      <span style={{ marginLeft: "auto", fontSize: 11, fontFamily: "'DM Mono', monospace", background: T.bg4, padding: "2px 7px", borderRadius: 100 }}>{results.length}</span>
                    </button>
                    {Object.entries(allGrouped).map(([sup, items]) => {
                      const key = normalize(sup)
                      const color = SUPPLIER_COLORS[key] || SUPPLIER_COLORS.default
                      return (
                        <button key={sup} style={S.supBtn(activeSupplier === key)} onClick={() => { setActiveSupplier(activeSupplier === key ? "" : key); setShowMobileFilter(false) }}>
                          <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
                          {sup}
                          <span style={{ marginLeft: "auto", fontSize: 11, fontFamily: "'DM Mono', monospace", background: T.bg4, padding: "2px 7px", borderRadius: 100 }}>{items.length}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
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
                    <div className="supplier-header" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingBottom: 14, borderBottom: `1px solid ${T.border}` }}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />
                      {logo && <img src={logo} alt={supplier} style={{ height: 22, width: "auto", objectFit: "contain" }} />}
                      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700 }}>{supplier}</span>
                      <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", background: T.bg4, color: T.text2, padding: "3px 10px", borderRadius: 100 }}>{items.length} résultats</span>
                    </div>
                    {currentView === "grid" ? (
                      <div className="results-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                        {items.map((item, i) => <PartCard key={i} item={item} />)}
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {items.map((item, i) => <ListItem key={i} item={item} />)}
                      </div>
                    )}
                    {hasMoreSuppliers[key] && (
                      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
                        <button onClick={() => loadMore(key)}
                          style={{ padding: "9px 28px", borderRadius: 8, background: T.bg3, border: `1px solid ${T.border}`, fontSize: 13, color: T.text2, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                          {loadingSuppliers[key] ? "Chargement…" : "+ Voir plus"}
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Google fallback */}
              {!loading && results.length === 0 && (googleLoading || googleResults.length > 0) && (
                <div style={{ marginBottom: 40 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingBottom: 14, borderBottom: `1px solid ${T.border}` }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ea4335", display: "inline-block", flexShrink: 0 }} />
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
                  {!googleLoading && googleResults.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {googleResults.map((item, i) => <ListItem key={i} item={item} />)}
                    </div>
                  )}
                </div>
              )}
            </main>
          </div>
        )}

        {/* ── ZOOM IMAGE ── */}
        {zoomImage && (
          <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => setZoomImage(null)}>
            <img src={zoomImage} alt="zoom" style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: 12, objectFit: "contain" }} />
          </div>
        )}
      </div>
    </>
  )
}
