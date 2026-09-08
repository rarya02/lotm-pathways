import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // The 32 pathway symbols are mostly ~3KB, so Vite's 4KB default inlined
    // them as base64 and added ~110KB to the entry chunk. Kept as separate
    // files they are cached individually and load after first paint instead of
    // blocking the bundle.
    assetsInlineLimit: 0,
  },
})
