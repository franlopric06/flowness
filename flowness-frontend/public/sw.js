// Este archivo reemplaza al service worker viejo de la PWA.
// Borra las copias guardadas del sitio y se desinstala solo,
// así todos los celulares y computadoras pasan a ver la versión nueva.
self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const claves = await caches.keys()
    await Promise.all(claves.map((clave) => caches.delete(clave)))
    await self.registration.unregister()
    const ventanas = await self.clients.matchAll({ type: 'window' })
    ventanas.forEach((ventana) => ventana.navigate(ventana.url))
  })())
})