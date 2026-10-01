import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@figranium-source': fileURLToPath(new URL('./.figranium-source/src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist/csr',
    emptyOutDir: false,
    assetsInlineLimit: 0,
    lib: {
      entry: fileURLToPath(new URL('./src/csr.tsx', import.meta.url)),
      name: 'FigraniumEmbed',
      formats: ['iife'],
      fileName: () => 'figranium-embed.csr.js',
    },
  },
});
