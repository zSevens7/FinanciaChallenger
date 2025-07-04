import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // <--- ADICIONE ESTA LINHA
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss() // <--- ADICIONE ESTA LINHA
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
});