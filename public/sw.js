// public/sw.js — Service Worker LiftParts Finder
const CACHE_NAME = 'lpf-v1'
const STATIC_ASSETS = [
  '/',
  '/login',
  '/logos/LiftParts-Finder.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
]

// Installation : mise en cache des assets statiques
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

// Activation : nettoyage des anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Fetch : stratégie Network First pour les API, Cache First pour les assets
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // API calls → toujours network, pas de cache
  if (url.pathname.startsWith('/api/')) {
    return
  }

  // Assets statiques → Cache First
  if (
    request.destination === 'image' ||
    request.destination === 'font' ||
    url.pathname.startsWith('/logos/') ||
    url.pathname.startsWith('/icons/')
  ) {
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

  // Pages → Network First avec fallback cache
  event.respondWith(
    fetch(request)
      .then(response => {
        const clone = response.clone()
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
        return response
      })
      .catch(() => caches.match(request))
  )
})
