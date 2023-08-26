<template>
  <div class="my-10 mx-2">
    <h1 class="mx-5">My Carts ({{ store.cart.length }})</h1>

    <v-card
      class="d-flex flex-column align-center py-5 mt-5"
      v-if="store.cart.length <= 0"
    >
      <v-card-title>Empty Carts</v-card-title>
      <div>
        <v-btn color="yellow" @click="goHome()">Homepage</v-btn>
      </div>
    </v-card>

    <CartsDetail />
  </div>
</template>
<script setup>
import { useMyCart } from "~/stores/myCart"

const router = useRouter()
const store = useMyCart()

const goHome = () => {
  router.push("/")
}
</script>
<style></style>
