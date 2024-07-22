import { getAuth } from "firebase/auth"
import { useMyAuth } from "~~/stores/myAuth"

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = getAuth()
  const authStore = useMyAuth()
  const user = auth.currentUser

  if (user) {
    authStore.setUser(user)
    if (to.path.includes("auth")) {
      return navigateTo("/")
    }
  } else {
    authStore.userRef = null
  }
})
