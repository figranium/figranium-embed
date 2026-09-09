import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@figranium-source': fileURLToPath(new URL('./.figranium-source/src', import.meta.url)),
    },
  },
  build: {
    outDir: '.tmp-iframe',
    emptyOutDir: true,
    rollupOptions: {
      input: fileURLToPath(new URL('./iframe.internal.html', import.meta.url)),
    },
  },
});
