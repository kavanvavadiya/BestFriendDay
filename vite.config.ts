import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.mp3', '**/*.wav', '**/*.ogg', '**/*.m4a'],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        banner: '',
        footer: '',
      },
    },
    terserOptions: {
      format: {
        comments: false,
      },
    },
  },
});
