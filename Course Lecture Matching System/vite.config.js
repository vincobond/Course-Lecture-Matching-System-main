import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    historyApiFallback: true
  },
  define: {
    // Use production URL for all builds
    'import.meta.env.VITE_CONVEX_URL': JSON.stringify('https://graceful-mouse-263.convex.cloud')
  },
  build: {
    // Ensure environment variables are available at build time
    envPrefix: 'VITE_'
  }
})

