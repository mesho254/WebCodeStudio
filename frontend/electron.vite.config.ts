import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    entry: 'electron/main.ts',  // Adjust if path changes
    publicDir: resolve(__dirname, 'electron/public'),
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    entry: 'electron/preload.ts'  // Create if needed, optional
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src')
      }
    },
    plugins: [react()]
  }
})