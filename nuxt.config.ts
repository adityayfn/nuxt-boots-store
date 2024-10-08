// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  css: [
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
  ],

  build: {
    transpile: ["vuetify", "vue-toastification", "node-fetch-native"],
  },

  runtimeConfig: {
    serverKey: process.env.NUXT_SERVER_KEY,

    public: {
      apiKey: process.env.NUXT_API_KEY,
      authDomain: process.env.NUXT_AUTH_DOMAIN,
      databaseURL: process.env.NUXT_DATABASE_URL,
      projectId: process.env.NUXT_PROJECT_ID,
      storageBucket: process.env.NUXT_STORAGE_BUCKET,
      messagingSenderId: process.env.NUXT_MESSAGING_SENDERID,
      appId: process.env.NUXT_APP_ID,

      clientKey: process.env.NUXT_CLIENT_KEY,
    },
  },

  vite: {
    define: {
      "process.env.DEBUG": false,
    },
  },

  modules: ["nuxt-swiper", "@pinia/nuxt", "nuxt-scheduler"],
  compatibilityDate: "2024-09-05",
})