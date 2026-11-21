import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative asset paths, so the build works under a subpath such as
  // GitHub Pages' /Odograph/ as well as at a domain root.
  base: './',
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
