import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/": {
        target: "http://api:5000",
        changeOrigin: true,
      },
    },
  },
});
