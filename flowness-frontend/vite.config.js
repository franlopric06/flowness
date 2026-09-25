import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // Cuando se publica una versión nueva, la app se actualiza sola
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Flowness - Movilidad, Flexibilidad y Mindfulness',
        short_name: 'Flowness',
        description: 'Método de movilidad, flexibilidad y mindfulness en seis fases progresivas.',
        lang: 'es',
        start_url: '/',
        display: 'standalone',
        background_color: '#F5F0EB',
        theme_color: '#7B9B77',
        icons: [
          { src: '/icono-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icono-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icono-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Borra las copias guardadas de versiones anteriores del sitio
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      },
    }),
  ],
})