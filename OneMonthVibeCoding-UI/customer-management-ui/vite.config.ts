import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Adjust the path and target as needed
      '/api': {
        target: 'http://localhost:5000', // Replace with your backend API URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
      // If your API path is different, adjust accordingly
      '/client': {
        target: 'http://localhost:5000', // Replace with your backend API URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/client/, '/client'),
      },
    },
  },
})
