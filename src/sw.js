const cacheName = 'v1.3.0'

self.addEventListener('install', (e) => {
  const fn = async () => {
    const res = await fetch('./cache-files.json')
    const files = await res.json()
    const cache = await caches.open(cacheName)
    cache.addAll(['./', ...files])
  }

  e.waitUntil(fn())
})

self.addEventListener('fetch', (e) => {
  const fn = async () => {
    let res = await caches.match(e.request, { ignoreSearch: true })
    if (!res) {
      res = await fetch(e)
      const cache = await caches.open(cacheName)
      cache.put(e.request, res.clone())
    }
    return res
  }

  e.respondWith(fn())
})

self.addEventListener('activate', (e) => {
  const fn = async () => {
    for (const key of await caches.keys()) {
      if (key !== cacheName) await caches.delete(key)
    }
  }

  e.waitUntil(fn())
})
