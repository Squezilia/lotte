import tailwindcss from '@tailwindcss/vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/hints',
    '@nuxt/image',
    'shadcn-nuxt',
  ],

  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [
      tailwindcss(),
      nodePolyfills({
        include: ['path'],
      }),
    ],
  },

  image: {
    domains: [
      'lh3.googleusercontent.com',
      'storage.googleapis.com',
      'www.google.com',
      'google.com',
    ],
  },

  fonts: {
    families: [
      {
        name: 'Plus Jakarta Sans',
        weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      },
    ],
  },
});
