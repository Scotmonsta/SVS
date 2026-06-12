import { defineConfig } from 'vite';

export default defineConfig({
  // Relative base so the build also works opened from a static host subpath.
  base: './',
  build: { outDir: 'dist' },
});
