import { version } from 'package.json'

self.addEventListener('install', (e) => {
  const fn = async () => {
    const res = await fetch('./cache-files.json')
    const files = await res.json()
    const cache = await caches.open(version)
    cache.addAll(['./', ...files])
  }

  e.waitUntil(fn())
})

self.addEventListener('fetch', (e) => {
  const fn = async () => {
    const res = await caches.match(e.request, { ignoreSearch: true })
    return res || fetch(e.request)
  }

  e.respondWith(fn())
})

self.addEventListener('activate', (e) => {
  const fn = async () => {
    for (const key of await caches.keys()) {
      if (key !== version) await caches.delete(key)
    }
  }

  e.waitUntil(fn())
})
