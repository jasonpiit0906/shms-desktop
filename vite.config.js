import { defineConfig } from 'vite'
import { resolve } from 'path'
// import react from '@vitejs/plugin-react'
// import electron from 'vite-plugin-electron'

export default defineConfig({
  main: {
    build: {
      outDir: 'dist/main'
    }
  },
  preload: {
    build: {
      outDir: 'dist/preload'
    }
  },
  renderer: {
    build: {
      outDir: 'dist/renderer'
    }
  }
})
