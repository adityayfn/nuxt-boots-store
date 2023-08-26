<template>
  <div>
    <v-menu transition="scale-transition" :close-on-content-click="false">
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props">
          <v-badge :content="store.cart.length">
            <v-icon icon="mdi mdi-cart" size="x-large"></v-icon>
          </v-badge>
        </v-btn>
      </template>

      <v-card width="350" color="yellow" class="mx-2">
        <v-card-item v-for="(item, index) in displayedItems" :key="index">
          <div class="d-flex align-center">
            <img :src="item.color" width="50" class="mr-2" />
            <h5 class="name mr-2">{{ item.name }}</h5>
            <h5 class="size">{{ item.size }}</h5>
            <h5 class="mx-2">
              {{ store.formatCurrency(store.singlePrice[index]) }}
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
                @click="item.quantity++"
              ></v-icon>
            </div>
          </div>
        </v-card-item>
        <div class="d-flex justify-center my-3">
          <div v-if="store.cart.length <= 0">
            <h3>Empty Carts</h3>
          </div>
          <v-btn
            color="black"
            class="text-yellow"
            @click="showCarts()"
            v-if="store.cart.length <= 3 && store.cart.length >= 1"
          >
            Show Carts</v-btn
          >

          <v-btn
            color="black"
            class="text-yellow"
            @click="showCarts()"
            v-if="store.cart.length > 3"
            >{{ store.cart.length - 3 }} More Items</v-btn
          >
        </div>
      </v-card>
    </v-menu>
  </div>
</template>
<script setup>
import { useMyCart } from "~/stores/myCart"
const store = useMyCart()
const router = useRouter()

const limit = ref(3)
const displayedItems = computed(() => {
  return store.cart.slice(0, limit.value)
})

const showCarts = () => {
  router.push("/product/carts")
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
