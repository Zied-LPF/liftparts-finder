"use client"

import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

const LPFLogo = ({ height = 80 }: { height?: number }) => (
  <svg viewBox="0 0 500 280" xmlns="http://www.w3.org/2000/svg" style={{ height, width: 'auto' }}>
    <defs>
      <linearGradient id="ogl" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#fb923c" /><stop offset="100%" stopColor="#ea6a0a" />
      </linearGradient>
      <linearGradient id="bgcardl" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1a1f2e" /><stop offset="100%" stopColor="#0d1018" />
      </linearGradient>
      <filter id="glow2l" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="softglowl" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <rect x="10" y="10" width="480" height="260" rx="18" fill="url(#bgcardl)" stroke="#f97316" strokeWidth="0.6" strokeOpacity="0.25" />
    <g stroke="#ffffff" strokeOpacity="0.025" strokeWidth="1">
      <line x1="10" y1="55" x2="490" y2="55" /><line x1="10" y1="100" x2="490" y2="100" />
      <line x1="10" y1="145" x2="490" y2="145" /><line x1="10" y1="190" x2="490" y2="190" />
      <line x1="10" y1="235" x2="490" y2="235" /><line x1="70" y1="10" x2="70" y2="270" />
      <line x1="140" y1="10" x2="140" y2="270" /><line x1="210" y1="10" x2="210" y2="270" />
      <line x1="280" y1="10" x2="280" y2="270" /><line x1="350" y1="10" x2="350" y2="270" />
      <line x1="420" y1="10" x2="420" y2="270" />
    </g>
    {/* Elevator shaft */}
    <rect x="36" y="36" width="4" height="180" rx="2" fill="#2a3040" />
    <rect x="78" y="36" width="4" height="180" rx="2" fill="#2a3040" />
    <g fill="#1e2530">
      <rect x="34" y="56" width="8" height="4" rx="1" /><rect x="34" y="80" width="8" height="4" rx="1" />
      <rect x="34" y="104" width="8" height="4" rx="1" /><rect x="34" y="128" width="8" height="4" rx="1" />
      <rect x="34" y="152" width="8" height="4" rx="1" /><rect x="76" y="56" width="8" height="4" rx="1" />
      <rect x="76" y="80" width="8" height="4" rx="1" /><rect x="76" y="104" width="8" height="4" rx="1" />
      <rect x="76" y="128" width="8" height="4" rx="1" /><rect x="76" y="152" width="8" height="4" rx="1" />
    </g>
    <rect x="40" y="72" width="40" height="52" rx="4" fill="#1e2840" stroke="#f97316" strokeWidth="1.5" filter="url(#glow2l)" />
    <line x1="60" y1="76" x2="60" y2="120" stroke="#f97316" strokeWidth="0.8" strokeOpacity="0.6" />
    <rect x="40" y="72" width="40" height="6" rx="2" fill="#f97316" opacity="0.9" />
    <rect x="46" y="84" width="12" height="10" rx="2" fill="#0d1018" stroke="#f97316" strokeWidth="0.8" strokeOpacity="0.5" />
    <rect x="62" y="84" width="12" height="10" rx="2" fill="#0d1018" stroke="#f97316" strokeWidth="0.8" strokeOpacity="0.5" />
    <circle cx="50" cy="104" r="1.5" fill="#f97316" opacity="0.9" />
    <line x1="50" y1="40" x2="50" y2="72" stroke="#8b92a8" strokeWidth="1" strokeOpacity="0.5" />
    <line x1="55" y1="40" x2="55" y2="72" stroke="#8b92a8" strokeWidth="1" strokeOpacity="0.5" />
    <line x1="62" y1="40" x2="62" y2="72" stroke="#8b92a8" strokeWidth="1" strokeOpacity="0.5" />
    <g fill="#f97316" opacity="0.7" filter="url(#glow2l)">
      <polygon points="59,46 64,56 54,56" />
    </g>
    <g stroke="#2a3040" strokeWidth="1">
      <line x1="32" y1="126" x2="86" y2="126" /><line x1="32" y1="172" x2="86" y2="172" />
    </g>
    {/* Floating gear */}
    <g transform="translate(100,58)" opacity="0.55">
      <circle r="11" fill="none" stroke="#f97316" strokeWidth="1.5" />
      <circle r="5" fill="none" stroke="#f97316" strokeWidth="1" />
      <g fill="#f97316">
        <rect x="-2" y="-13" width="4" height="5" rx="1" /><rect x="-2" y="8" width="4" height="5" rx="1" />
        <rect x="8" y="-2" width="5" height="4" rx="1" /><rect x="-13" y="-2" width="5" height="4" rx="1" />
      </g>
    </g>
    {/* LPF text */}
    <text x="252" y="122" fontFamily="'Arial Black','Arial',sans-serif" fontSize="96" fontWeight="900" letterSpacing="2" textAnchor="middle" fill="url(#ogl)" filter="url(#softglowl)">LPF</text>
    {/* Magnifier */}
    <g transform="translate(432,72)" filter="url(#glow2l)">
      <circle r="26" fill="#0d1018" fillOpacity="0.55" stroke="#f97316" strokeWidth="2" />
      <circle r="21" fill="#f97316" fillOpacity="0.04" />
      <rect x="-6" y="-17" width="1.8" height="24" rx="1" fill="#2a3040" />
      <rect x="5" y="-17" width="1.8" height="24" rx="1" fill="#2a3040" />
      <rect x="-5.5" y="-12" width="12" height="14" rx="2" fill="#1e2840" stroke="#f97316" strokeWidth="0.8" />
      <rect x="-5.5" y="-12" width="12" height="3" rx="1" fill="#f97316" opacity="0.9" />
      <g stroke="#f97316" strokeWidth="1" strokeOpacity="0.55" fill="none">
        <path d="M-18,-18 L-18,-12 M-18,-18 L-12,-18" /><path d="M18,-18 L18,-12 M18,-18 L12,-18" />
        <path d="M-18,18 L-18,12 M-18,18 L-12,18" /><path d="M18,18 L18,12 M18,18 L12,18" />
      </g>
      <circle cx="13" cy="-14" r="1.5" fill="#fb923c" opacity="0.9" />
      <line x1="19" y1="19" x2="32" y2="32" stroke="#f97316" strokeWidth="3.5" strokeLinecap="round" />
    </g>
    {/* Line + labels */}
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

export default function Login() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin() {
    if (!password) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      if (res.ok) {
        document.cookie = 'lpf_auth=1; Path=/; Max-Age=86400'
        window.dispatchEvent(new Event('lpf_login'))
        router.replace('/')
      } else {
        setError('Mot de passe incorrect.')
      }
    } catch {
      setError('Erreur réseau, réessayez.')
    }
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>LiftParts Finder — Connexion</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </Head>
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0a0b0d', fontFamily: "'DM Sans', sans-serif", position: 'relative', overflow: 'hidden'
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(249,115,22,0.08) 0%, transparent 70%), radial-gradient(ellipse 60% 80% at 20% 80%, rgba(59,130,246,0.06) 0%, transparent 60%)'
        }} />
        {/* Grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)'
        }} />

        {/* Card */}
        <div style={{
          position: 'relative', zIndex: 1,
          width: '100%', maxWidth: 420,
          margin: '0 16px',
          padding: '40px 36px',
          background: '#111318',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 20,
          boxShadow: '0 4px 40px rgba(0,0,0,0.5), 0 0 60px rgba(249,115,22,0.06)'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
            <LPFLogo height={80} />
          </div>

          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 700, color: '#f0f2f7', marginBottom: 6 }}>
            Accès plateforme
          </h1>
          <p style={{ fontSize: 14, color: '#8b92a8', marginBottom: 28 }}>
            Entrez votre mot de passe pour accéder au moteur de recherche.
          </p>

          <label style={{ fontSize: 11, fontWeight: 600, color: '#8b92a8', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="••••••••"
            autoComplete="current-password"
            style={{
              width: '100%', padding: '13px 16px',
              background: '#181c24', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10, color: '#f0f2f7',
              fontFamily: "'DM Mono', monospace", fontSize: 15,
              outline: 'none', marginBottom: 16, boxSizing: 'border-box',
              transition: 'border-color .2s'
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#f97316'}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: '100%', padding: '13px',
              background: loading ? '#7c3a10' : '#f97316',
              color: '#fff', border: 'none', borderRadius: 10,
              fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity .2s', letterSpacing: '0.03em'
            }}
          >
            {loading ? 'Connexion…' : 'Accéder →'}
          </button>

          {error && (
            <p style={{ color: '#ef4444', fontSize: 13, marginTop: 12, textAlign: 'center' }}>
              {error}
            </p>
          )}
        </div>
      </div>
    </>
  )
}
