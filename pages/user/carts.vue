<template>
  <div class="my-10 mx-2">
    <h1 class="mx-5">My Carts ({{ store?.carts?.length }})</h1>

    <v-card
      class="d-flex flex-column align-center py-5 mt-5"
      v-if="store?.carts?.length <= 0"
    >
      <v-card-title>Empty Carts</v-card-title>
      <div>
        <v-btn color="yellow" @click="goHome()">Homepage</v-btn>
      </div>
    </v-card>

    <OrganismCartsDetail />
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
})
import { getAuth } from "firebase/auth"
import { useMyCart } from "~/stores/myCart"

const router = useRouter()
const store = useMyCart()
const auth = getAuth()

const goHome = () => {
  router.push("/")
}

onMounted(() => {
  fetchFirestoreDatas()
  if (auth.currentUser == null) {
    router.push("/")
  }
})
</script>
<style scoped>
.min-h-80 {
  height: 80vh;
}
</style>
