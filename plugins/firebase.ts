import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

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
  const auth = getAuth(app)
  const firestore = getFirestore(app)

  nuxtapp.provide("db", db)
  nuxtapp.provide("auth", auth)
  nuxtapp.provide("firestore", firestore)
})
