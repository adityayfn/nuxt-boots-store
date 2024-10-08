import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
  type User,
} from "firebase/auth"
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore"
import { defineStore } from "pinia"

import { useToast } from "vue-toastification"
import { useMyCart } from "./myCart"
import type { MyAuthStoreType } from "../interface/"

export const useMyAuth = defineStore("myAuth", {
  state: (): MyAuthStoreType => ({
    name: null,
    username: null,
    email: null,
    password: null,
    userRef: null,
    usernameAvailable: null,
    newUsername: null,
    address: null,
    userProfile: null,
    modalOpen: false,
  }),
  actions: {
    reset() {
      this.name = null
      this.username = null
      this.email = null
      this.password = null
    },

    async checkUsername() {
      const nuxt = useNuxtApp()
      const toast = useToast()
      const route = nuxt._route.path
      const db = nuxt.$db as Firestore

      const usersRef = collection(db, "users")
      const q = query(
        usersRef,
        where(
          "username",
          "==",
          route.includes("user") ? this.newUsername : this.username
        )
      )
      const querySnapshot = await getDocs(q)

      this.usernameAvailable = !querySnapshot.empty

      if (this.usernameAvailable) {
        toast.error("Username Already Exist")
        this.username = null
      } else {
        toast.success("Username Available")
      }
    },

    async register() {
      const toast = useToast()
      const auth = getAuth()
      const nuxt = useNuxtApp()
      const db = nuxt.$db as Firestore
      const usersRef = collection(db, "users")

      if (this.usernameAvailable == null) {
        toast.error("Please check username first")
      } else {
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            this.email!!,
            this.password!!
          )
          const user = userCredential.user
          await updateProfile(auth.currentUser!!, {
            displayName: this.username,
          })
          await setDoc(doc(usersRef, user.uid), {
            username: this.username,
            name: this.name,
            email: this.email,
            createdAt: new Date(),
          })

          toast.success("Register Success, Welcome!")

          this.reset()
        } catch (error: any) {
          toast.error(error.code)
        }
      }
    },
    async login() {
      const auth = getAuth()
      const toast = useToast()

      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          this.email!!,
          this.password!!
        )

        toast.success("Login Success")
        this.userRef = userCredential
      } catch (error: any) {
        toast.error(error.code)
      }
    },
    async logout() {
      const auth = getAuth()
      const toast = useToast()

      const myCarts = useMyCart()
      try {
        await auth.signOut()
        this.reset()
        myCarts.carts = []
        toast.success("Logout Successfull")
        setTimeout(() => {
          window.location.replace("/auth/signin")
        }, 1000)
      } catch (error: any) {
        toast.error(error.code)
      }
    },
    async getProfile() {
      const auth = getAuth()
      const nuxt = useNuxtApp()
      const uid = auth?.currentUser?.uid as string
      const db = nuxt.$db as Firestore
      const userDoc = doc(db, "users", uid)

      const profileSnapshot = await getDoc(userDoc)
      this.userProfile = profileSnapshot.data()

      return this.userProfile
    },

    async editProfile() {
      const auth = getAuth()
      const nuxt = useNuxtApp()
      const toast = useToast()
      const db = nuxt.$db as Firestore
      const uid = auth?.currentUser?.uid as string

      const userDoc = doc(db, "users", uid)

      const userSnapshot = await getDoc(userDoc)
      const userDocSnap = userSnapshot.data()

      if (this.address == null && this.newUsername == null) {
        return toast.error(
          "Please fill in one of the fields or just close this form"
        )
      }

      if (auth.currentUser) {
        if (this.address == null) {
          if (this.usernameAvailable == null) {
            toast.error("Please check username first!")
          } else {
            await updateDoc(userDoc, {
              ...userDocSnap,
              username: this.newUsername,
            })
            await updateProfile(auth.currentUser, {
              displayName:
                this.newUsername != null
                  ? this.newUsername
                  : userDocSnap?.username,
            })
            toast.success("Username Updated!")
            this.modalOpen = !this.modalOpen
            this.newUsername = null
          }
        } else if (this.newUsername == null) {
          await updateProfile(auth.currentUser, {
            displayName:
              this.newUsername != null
                ? this.newUsername
                : userDocSnap?.username,
          })
          await updateDoc(userDoc, {
            ...userDocSnap,
            address: this.address,
          })
          toast.success("Address Updated!")
          this.modalOpen = !this.modalOpen

          this.address = null
        } else {
          if (this.usernameAvailable == null) {
            toast.error("Please check username first!")
          } else {
            await updateProfile(auth.currentUser, {
              displayName: this.newUsername,
            })
            await updateDoc(userDoc, {
              ...userDocSnap,
              username: this.newUsername,
              address: this.address,
            })
            toast.success("Username and Address Updated!")
            this.modalOpen = !this.modalOpen
            this.newUsername = null
            this.address = null
          }
        }
      } else {
        console.log("No user is currently signedin")
      }
    },
    setUser(user: User) {
      this.userRef = user
    },
    loadUser() {
      const auth = getAuth()
      const user = auth.currentUser
      if (user) {
        this.userRef = user
      }
    },
  },
})
