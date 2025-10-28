import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({ 
    registerType: 'autoUpdate',
    manifest: {
      name: 'WebCode Studio',
      short_name: 'WebCode',
      icons: [
        {
          src: '/pwa-192x192.png',  // Add icons if needed
          sizes: '192x192',
          type: 'image/png'
        }
      ]
    }
  })],
  server: {
    port: 5173,
  },
})