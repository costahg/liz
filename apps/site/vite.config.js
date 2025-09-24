// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// publica o app em /relatorio/
export default defineConfig({
  plugins: [react()],
  base: '/relatorio/',            // <<< ESSENCIAL pro subcaminho
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  }
})
