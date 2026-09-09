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
    outDir: 'dist/iframe',
    emptyOutDir: false,
    rollupOptions: {
      input: fileURLToPath(new URL('./index.html', import.meta.url)),
    },
  },
});
