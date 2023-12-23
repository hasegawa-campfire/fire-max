import { html2module } from './lib/html-module.mjs'

async function fetchModuleHtml(req) {
  const res = await fetch(req)
  const html = await res.text()
  const script = html2module(html)

  const headers = new Headers(res.headers)
  headers.set('Content-Type', 'text/javascript')
  headers.set('Content-Length', new Blob([script]).size)

  return new Response(script, {
    status: res.status,
    statusText: res.statusText,
    headers: headers,
  })
}

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url)
  if (url.pathname.endsWith('.m.html')) {
    e.respondWith(fetchModuleHtml(e.request))
  }
})

self.addEventListener('install', (e) => e.waitUntil(self.skipWaiting()))
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))
