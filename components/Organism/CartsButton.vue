<template>
  <div>
    <v-menu transition="scale-transition" :close-on-content-click="false">
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props">
          <v-badge :content="store.carts.length || 0">
            <v-icon icon="mdi mdi-cart" size="x-small"></v-icon>
          </v-badge>
        </v-btn>
      </template>

      <v-card width="350" color="yellow" class="mx-2">
        <v-card-item v-for="(item, index) in displayedItems" :key="index">
          <div class="d-flex align-center">
            <img :src="item.color" width="50" class="mr-2" alt="image-item" />
            <h5 class="name mr-2">{{ item.name }}</h5>
            <h5 class="size">{{ item.size }}</h5>
            <h5 class="mx-2">
              {{ formatCurrency(item.price, "IDR") }}
            </h5>
            <div class="d-flex align-center icon">
              <v-icon
                icon="mdi-minus ml-1 "
                class="cursor-pointer"
                @click="store.deleteItem(item)"
              ></v-icon>
              <h5>{{ item.quantity }}</h5>
              <v-icon
                icon="mdi-plus mr-1 "
                class="cursor-pointer"
                @click="store.addQty(item)"
              ></v-icon>
            </div>
          </div>
        </v-card-item>
        <div class="d-flex justify-center my-3">
          <div v-if="store.carts.length <= 0">
            <h3>Empty Carts</h3>
          </div>
          <v-btn
            color="black"
            class="text-yellow"
            @click="showCarts()"
            v-if="store.carts.length <= 3 && store.carts.length >= 1"
          >
            Show Carts</v-btn
          >

          <v-btn
            color="black"
            class="text-yellow"
            @click="showCarts()"
            v-if="store.carts.length > 3"
            >{{ store.carts.length - 3 }} More Items</v-btn
          >
        </div>
      </v-card>
    </v-menu>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { useRouter } from "vue-router"
import { doc, onSnapshot, Firestore } from "firebase/firestore"
import { useMyAuth } from "~/stores/myAuth"
import { useMyCart } from "~/stores/myCart"
import type { CartType } from "@/interface/"
import type { User } from "firebase/auth"

const store = useMyCart()
const router = useRouter()
const nuxt = useNuxtApp()

const uid = ref<string>("")

const limit = ref(3)
const displayedItems = computed((): CartType[] => {
  return store.carts.slice(0, limit.value)
})

const setupCartListener = () => {
  const db = nuxt.$db as Firestore
  if (uid.value) {
    const userDocRef = doc(db, "users", uid.value)
    onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        store.carts = docSnapshot.data().carts || []
      } else {
        store.carts = []
      }
    })
  }
}

const storeAuth = useMyAuth()

watch(
  () => storeAuth.userRef,
  (newUserRef, oldUserRef) => {
    // Pengecekan apakah newUserRef adalah objek user yang valid
    if (newUserRef && "uid" in newUserRef) {
      const user = newUserRef as User // casting ke tipe User jika perlu
      if (user.uid !== uid.value) {
        uid.value = user.uid
        setupCartListener()
      }
    }
  },
  { immediate: true }
)

// watch(
//   () => storeAuth.userRef,
//   (newUserRef, oldUserRef) => {
//     if (newUserRef && newUserRef.uid !== uid.value) {
//       uid.value = newUserRef.uid
//       setupCartListener()
//     }
//   },
//   { immediate: true }
// )

const showCarts = () => {
  router.push("/user/carts")
}
</script>

<style>
.name {
  width: 200px;
}
.size {
  width: 100px;
}
.icon {
  border-radius: 10px;
  background-color: #000;
  color: yellow;
}
</style>
