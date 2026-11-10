import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import posts from './posts.plugin.ts'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [posts(), react()],
  build: {
    // The SSR bundle is only used to prerender the pages; it doesn't need public/.
    copyPublicDir: !isSsrBuild,
  },
}))
