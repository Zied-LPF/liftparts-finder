// public/sw.js — Service Worker LiftParts Finder v2
const CACHE_NAME = 'lpf-v2'
const STATIC_ASSETS = [
  '/',
  '/login',
  '/manifest.json',
  '/logos/lpf-logo.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
]

// Installation : mise en cache des assets statiques
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  )
})

// Activation : nettoyage des anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

// Fetch : stratégie adaptée par type de ressource
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Ignorer les requêtes non-GET
  if (request.method !== 'GET') return

  // API calls → toujours network, jamais de cache
  if (url.pathname.startsWith('/api/')) {
    return
  }

  // Assets statiques (images, fonts, logos, icons) → Cache First
  if (
    request.destination === 'image' ||
    request.destination === 'font' ||
    url.pathname.startsWith('/logos/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname === '/manifest.json'
  ) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached
        return fetch(request).then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
          return response
        })
      })
    )
    return
  }

  // JS/CSS Next.js → Cache First (immutable)
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached
        return fetch(request).then(response => {
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
          return response
        })
      })
    )
    return
  }

  // Pages HTML → Network First avec fallback cache
  event.respondWith(
    fetch(request)
      .then(response => {
        if (!response || response.status !== 200) return response
        const clone = response.clone()
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
        return response
      })
      .catch(() => caches.match(request))
  )
})

// Écouter le message skipWaiting depuis le client
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
