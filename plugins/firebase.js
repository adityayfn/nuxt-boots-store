import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs } from "firebase/firestore/lite"

export default defineNuxtPlugin((nuxtapp) => {
  const config = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: config.public.apiKey,
    authDomain: config.public.authDomain,
    databaseURL: config.public.databaseURL,
    projectId: config.public.projectId,
    storageBucket: config.public.storageBucket,
    messagingSenderId: config.public.messagingSenderId,
    appId: config.public.appId,
  }
  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)

  nuxtapp.provide("db", db)
})
