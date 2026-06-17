import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'Revision Master',
          short_name: 'RevisionMaster',
          description: 'Study. Revise. Master.',
          theme_color: '#7f13ec',
          background_color: '#191022',
          display: 'standalone',
          icons: [
            {
              src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0D9zosCq11-SfHs4olEz6fF9Ai6iLUTksEN0J6JNmxO8BFkTHxy1wy_YjBoGMYYSwLS83Bn_Pqe7-RBx7onjWqVeoHkxYYplWkS0QWAfucMFqAdS38AVyQ7ALuKvyG_eNTGGXkaZsCfGo856e_ntxGd0Xd-YiumVfyro1OZ6qs2Df7eZyZc4hifPyN_fTU4oL9K-puwWzkazv6BD_955f9TVlc_EglXydrXW3wOVoFVgkI0JHDw-PGlgV52AvPZpVza6iM-AKuhTT',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0D9zosCq11-SfHs4olEz6fF9Ai6iLUTksEN0J6JNmxO8BFkTHxy1wy_YjBoGMYYSwLS83Bn_Pqe7-RBx7onjWqVeoHkxYYplWkS0QWAfucMFqAdS38AVyQ7ALuKvyG_eNTGGXkaZsCfGo856e_ntxGd0Xd-YiumVfyro1OZ6qs2Df7eZyZc4hifPyN_fTU4oL9K-puwWzkazv6BD_955f9TVlc_EglXydrXW3wOVoFVgkI0JHDw-PGlgV52AvPZpVza6iM-AKuhTT',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5000,
      allowedHosts: true,
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      target: 'es2020',
      minify: 'esbuild',
      cssMinify: true,
      sourcemap: false,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'motion': ['framer-motion', 'motion'],
            'icons': ['lucide-react'],
            'pdf': ['html2pdf.js', 'html2canvas', 'jspdf', 'pdfjs-dist'],
            'charts': ['recharts'],
          },
        },
      },
    },
  };
});
