import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const onVercel = Boolean((globalThis as { process?: { env?: { VERCEL?: string } } }).process?.env?.VERCEL);

export default defineConfig(({ command }) => ({
  // GitHub Pages serves the app from /30Day-Challenge/. Vercel serves it from the domain root.
  base: onVercel ? '/' : command === 'build' ? '/30Day-Challenge/' : '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png', 'icon.svg'],
      manifest: {
        name: '30-Day Social Challenge',
        short_name: '30-Day',
        description: 'A gamified 30-day path to social confidence, charisma, and real connection.',
        theme_color: '#10B981',
        background_color: '#FFF9F0',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '.',
        scope: '.',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
      },
    }),
  ],
}));
