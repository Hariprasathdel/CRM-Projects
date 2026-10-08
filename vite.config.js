import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Ensure dependencies such as React-Bootstrap always use the same React
  // instance as the application. This prevents invalid hook calls when a
  // dependency can otherwise resolve React from a parent node_modules folder.
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5002',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://localhost:5002',
        changeOrigin: true,
      }
    }
  },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
