import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Architecture_Website_by_Pqui/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
  