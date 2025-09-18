import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss() // Mantendo o plugin do Tailwind
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    // Proxy para API no desenvolvimento
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  // Configuração para build
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  // Configuração para preview
  preview: {
    port: 3000
  }
});