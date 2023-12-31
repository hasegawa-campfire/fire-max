import { version } from '../package.json'

const cacheFiles = CACHE_FILES

async function onInstall(e) {
  const cache = await caches.open(version)
  await cache.addAll(['./', ...cacheFiles])
  self.skipWaiting()
}

async function onActivate(e) {
  for (const key of await caches.keys()) {
    if (key !== version) await caches.delete(key)
  }
}

async function onFetch(e) {
  const res = await caches.match(e.request, { ignoreSearch: true })
  return res || fetch(e.request)
}

self.addEventListener('install', (e) => e.waitUntil(onInstall(e)))
self.addEventListener('activate', (e) => e.waitUntil(onActivate(e)))
self.addEventListener('fetch', (e) => e.respondWith(onFetch(e)))
