import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  build: {
    // The SSR bundle is only used to prerender index.html; it doesn't need public/.
    copyPublicDir: !isSsrBuild,
  },
}))
