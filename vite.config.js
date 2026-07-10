import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// For GitHub Pages: set base to '/your-repo-name/'
// For local / Vercel / Netlify: leave as './'
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_URL || './',
})
