<template>
  <div v-if="store.carts.length >= 1">
    <v-card
      class="my-5"
      variant="outlined"
      :class="$vuetify.display.mdAndUp ? 'mx-10' : ''"
    >
      <v-card-item v-for="(item, index) in store.carts">
        <div
          class="d-flex relative justify-space-between flex-wrap"
          :class="
            $vuetify.display.sm
              ? 'font-5'
              : $vuetify.display.mdAndUp
              ? 'font-10'
              : ''
          "
        >
          <div class="absolute">
            <input
              type="checkbox"
              class="input-checkbox"
              :checked="store.carts[index].selected"
              @change="onItemChange(item, index)"
            />
          </div>
          <div >
            <h4 class="text-center font-base">Product</h4>
            <div
              class="d-flex justify-center"
              :class="
                $vuetify.display.xs
                  ? 'w-xs'
                  : $vuetify.display.sm
                  ? 'w-sm'
                  : 'w-md-up'
              "
            >
              <img
                :src="item.color"
                alt="image-variant"
                :width="$vuetify.display.smAndUp ? 100 : 50"
                class="mr-2"
              />
              <h5 class="text-center font-500">{{ item.name }}</h5>
            </div>
          </div>

          <div >
            <h4 class="text-center font-base">Size</h4>
            <div>
              <h5 class="text-center font-500">{{ item.size }}</h5>
            </div>
          </div>
          <div>
            <h4 class="text-center font-base">Price</h4>
            <div>
              <h5 class="text-center font-500">
                {{ formatCurrency(item.price, "USD") }}
              </h5>
            </div>
          </div>
          <div>
            <h4 class="text-center font-base">Quantity</h4>
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
        </div>
      </v-card-item>
    </v-card>
    <v-card
      class="d-flex align-center justify-space-between px-5 py-5"
      variant="outlined"
      :class="$vuetify.display.mdAndUp ? 'mx-10' : ''"
    >
      <div class="flex-1-1">
        <input
          type="checkbox"
          class="input-checkbox"
          :checked="store.selectAll"
          @change="onSelectAllChange()"
        />
      </div>
      <div class="d-flex flex-column align-center mr-6">
        <h4>Total Price</h4>
        <h5>{{ formatCurrency(store.cartTotal, "USD") }}</h5>
      </div>

      <v-btn
        color="black"
        class="bg-yellow"
        variant="text"
        @click="store.checkout(checkoutedItems)"
      >
        CHECKOUT
      </v-btn>
    </v-card>
  </div>
</template>
<script setup>
import { getAuth } from "firebase/auth"
import { doc, updateDoc } from "firebase/firestore"

import { useMyCart } from "~/stores/myCart"

const store = useMyCart()

const nuxt = useNuxtApp()
const userDocRef = ref()

const checkoutedItems = computed(() => {
  const items = store.carts.filter((item) => item.selected == true)
  return items
})

const isAllSelect = () => {
  return store.carts.every((item) => item.selected)
}

const updateSelectAll = () => {
  store.selectAll = isAllSelect()
}

const onSelectAllChange = async () => {
  const newSelectAll = !store.selectAll
  store.carts.forEach((item) => (item.selected = newSelectAll))
  store.selectAll = newSelectAll

  await updateDoc(userDocRef.value, {
    carts: store.carts,
  })
}

const onItemChange = async (item, index) => {
  const newSelected = !item.selected
  store.carts[index].selected = newSelected

  await updateDoc(userDocRef.value, {
    carts: store.carts,
  })

  updateSelectAll()
}

watchEffect(() => {
  store.carts
  updateSelectAll()
})
onMounted(() => {
  if (getAuth().currentUser) {
    userDocRef.value = doc(nuxt.$db, "users", getAuth().currentUser.uid)
  }
})
</script>
<style scoped>
.w-xs {
  width: 150px;
}
.w-sm {
  width: 230px;
}
.w-md-up {
  width: 350px;
}

.font-base {
  font-size: 1.1rem !important ;
}
.font-5 {
  font-size: 1.3rem;
}
.font-10 {
  font-size: 1.5rem;
}
.input-checkbox {
  width: 18px;
  height: 18px;
}
</style>
