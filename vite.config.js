import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig(({ command }) => ({
  // GitHub Pages project site needs /Phonetest/; local dev should stay at /
  base: command === 'build' ? '/Phonetest/' : '/',
  plugins: [react(), tailwindcss()],
}))
