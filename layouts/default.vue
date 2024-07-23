<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar class="py-2 px-3" color="#000000">
      <div v-if="isXs && $vuetify.display.xs">
        <v-app-bar-nav-icon
          variant="text"
          @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>
      </div>

      <nuxt-link to="/">
        <img src="/logo.webp" alt="logo" class="ml-2" style="width: 70px"
      /></nuxt-link>
      <v-spacer></v-spacer>
      <div v-for="item in items" class="d-flex" v-if="$vuetify.display.smAndUp">
        <nuxt-link
          :to="item.path"
          class="link px-3"
          :class="pathname.path === item.path ? 'text-yellow' : ''"
        >
          <h3>{{ item.title }}</h3>
        </nuxt-link>
      </div>

      <v-spacer></v-spacer>
      <div class="d-flex justify-center align-center ga-1">
        <v-card color="yellow" class="pt-1">
          <OrganismCartsButton />
        </v-card>
        <v-btn
          v-if="store.userRef == null"
          class="bg-yellow"
          @click="router.push('/auth/signin')"
          >Login</v-btn
        >

        <OrganismProfileHover
          v-if="store.userRef != null"
          :profile="store.userRef"
        />
      </div>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      :location="$vuetify.display.mobile ? 'top' : undefined"
      temporary
      color="black"
      v-if="drawerOnLoad"
    >
      <v-list class="mt-3">
        <div v-for="item in items" class="d-flex ga-4">
          <nuxt-link
            :to="item.path"
            class="link px-3"
            :class="pathname.path === item.path ? 'text-yellow' : ''"
          >
            <h2>{{ item.title }}</h2>
          </nuxt-link>
        </div>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <slot />
    </v-main>
  </v-layout>
  <Footer />
</template>
<script setup>
definePageMeta({
  middleware: ["auth"],
})
import { getAuth } from "firebase/auth"
import { useMyAuth } from "~/stores/myAuth"

const auth = getAuth()
const store = useMyAuth()

const router = useRouter()
const pathname = useRoute()
const drawer = ref(false)
const items = [
  {
    title: "Home",
    value: "home",
    path: "/",
  },
  {
    title: "Products",
    value: "products",
    path: "/products",
  },
]

const isXs = ref(false)
const drawerOnLoad = ref(false)

onBeforeMount(() => {
  isXs.value = true
  drawerOnLoad.value = true
  auth.onAuthStateChanged((user) => {
    store.userRef = user
  })
})
</script>
<style>
.hidden {
  display: none;
}
.block {
  display: block;
}
</style>
