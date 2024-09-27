// https://nuxt.com/docs/api/configuration/nuxt-config
import path from 'path'
import fs from 'fs'
export default defineNuxtConfig({
  devtools: { enabled: false },
  runtimeConfig: {
    // The private keys which are only available within server-side
    apiSecret: '123',
    // Keys within public, will be also exposed to the client-side
    public: {
      endpoint: process.env.ENDPOINT
    }
  },
  app:{
    head:{
      // script:[
      //     "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js",
      //     "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js",
      // ]
    }
  },
  routeRules: {
    // Homepage pre-rendered at build time
    '/panel*': {ssr: false},
    '/': { redirect: '/veganlog' }
  },
  modules: ["nuxt-quasar-ui", "@vite-pwa/nuxt", "nuxt-vuefire"],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'localhost-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'localhost.pem'))
    }
  },vuefire: {
    config:{
      apiKey: "AIzaSyDBLrsp6EWHTNu0fynODZpKiPq2iL8M2wU",
      authDomain: "hello-vegan.firebaseapp.com",
      projectId: "hello-vegan",
      storageBucket: "hello-vegan.appspot.com",
      messagingSenderId: "86454988086",
      appId: "1:86454988086:web:d4894c94467cb5907f1797",
      measurementId: "G-KVGV7EHCNN",
      vapidKey:"BBxc23p9Ond5HWi5Jl829qdWfYyT6ygAun0cZLhClIrbzH63j"
    }
  }
})