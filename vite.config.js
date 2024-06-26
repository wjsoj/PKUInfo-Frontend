import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'PKU Info',
        short_name: 'PKU Info',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/favicon.png',
            sizes: '700x700',
            type: 'image/png',
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html',
      },
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg}'],
      },
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy:{
      '/api': {
        target: 'https://pkuinfo.lcpu.dev',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/api':'/'
        }
      },
      '/account': {
        target: 'https://m.gsdata.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/account/, '/api/account/search/list'),
      },
      '/monitor': {
        target: 'https://pkuinfo.lcpu.dev',
        changeOrigin: true,
      }
    }
  }
})
