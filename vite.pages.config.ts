import path from 'node:path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { staticPages } from './build/static-pages';

// Portable: no Replit environment, backend, secrets, or workspace library imports.
export default defineConfig({
  base: '/',
  root: import.meta.dirname,
  plugins: [react(), tailwindcss(), staticPages()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, 'src') },
    dedupe: ['react', 'react-dom'],
  },
  build: {
    outDir: 'dist/public',
    emptyOutDir: true,
    sourcemap: false,
  },
  server: { host: '0.0.0.0', port: 5173 },
  preview: { host: '0.0.0.0', port: 4173 },
});
