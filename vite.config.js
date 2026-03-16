// PATH: vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Resolve all packages from project node_modules
      // so custom templates can import them from outside the project
      'remotion': path.resolve(__dirname, 'node_modules/remotion'),
      '@remotion/player': path.resolve(__dirname, 'node_modules/@remotion/player'),
      '@remotion/transitions': path.resolve(__dirname, 'node_modules/@remotion/transitions'),
      '@remotion/shapes': path.resolve(__dirname, 'node_modules/@remotion/shapes'),
      '@remotion/paths': path.resolve(__dirname, 'node_modules/@remotion/paths'),
      '@remotion/google-fonts': path.resolve(__dirname, 'node_modules/@remotion/google-fonts'),
      '@remotion/captions': path.resolve(__dirname, 'node_modules/@remotion/captions'),
      '@remotion/media-utils': path.resolve(__dirname, 'node_modules/@remotion/media-utils'),
      '@remotion/noise': path.resolve(__dirname, 'node_modules/@remotion/noise'),
      '@remotion/three': path.resolve(__dirname, 'node_modules/@remotion/three'),
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      'three': path.resolve(__dirname, 'node_modules/three'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    fs: {
      allow: ['..', '/'],
      strict: false,
    },
  },
})