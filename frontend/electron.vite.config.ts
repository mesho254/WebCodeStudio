import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: resolve(__dirname, 'main.ts'),  // Root-level main.ts
      },
      outDir: 'dist-electron',
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: resolve(__dirname, 'preload.ts'),  // Root-level preload.ts
      },
      outDir: 'dist-preload',
    },
  },
  renderer: {
    root: '.',  // Use project root as renderer base (where index.html lives)
    resolve: {
      alias: {
        '@renderer': resolve('src'),
      },
    },
    plugins: [react()],
    build: {
      rollupOptions: {
        input: '/index.html',  // Explicit root index.html entry (absolute from root)
      },
      outDir: 'dist',
    },
  },
});