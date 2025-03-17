import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'

export default defineConfig({
  plugins: [
    react(),
    electron({
      entry: 'electron/main/index.js'
    })
  ],
  base: './',
  build: {
    outDir: 'dist/renderer',
    assetsDir: '.',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/renderer/index.html')
      }
    },
    emptyOutDir: true
  }
})
