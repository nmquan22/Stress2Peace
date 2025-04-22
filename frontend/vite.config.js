import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      // Proxy API calls to the backend server
      '/api': {
        target: 'http://localhost:5000', // change this to your backend port
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
