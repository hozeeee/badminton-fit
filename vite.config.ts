import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }) => {
  const single = mode === 'single'
  return {
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      single
        ? viteSingleFile()
        : VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'inline',
            manifest: {
              name: '羽练 · Badminton Fit',
              short_name: '羽练',
              description: '理解肌肉，科学训练，记录每一次进步。',
              theme_color: '#176b50',
              background_color: '#f6f8f5',
              display: 'standalone',
              start_url: './',
              scope: './',
              icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
            },
            workbox: { globPatterns: ['**/*.{js,css,html,svg}'], maximumFileSizeToCacheInBytes: 4000000 },
          }),
    ],
    build: { outDir: single ? 'dist-single' : 'dist', assetsInlineLimit: single ? Infinity : 4096 },
    test: { environment: 'node', include: ['tests/**/*.test.ts'] },
  }
})
