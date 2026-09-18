import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      // Three HTML entries: the two real pages, plus a root doormat that
      // redirects to the visitor's language. Shared chunks are hoisted
      // automatically, so en/ and nl/ do not each ship their own copy of React.
      input: {
        root: resolve(import.meta.dirname, 'index.html'),
        en: resolve(import.meta.dirname, 'en/index.html'),
        nl: resolve(import.meta.dirname, 'nl/index.html'),
      },
    },
  },
})
