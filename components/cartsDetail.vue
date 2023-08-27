<template>
  <div v-if="store.cart.length >= 1">
    <v-card
      class="my-5"
      variant="outlined"
      :class="$vuetify.display.mdAndUp ? 'mx-10' : ''"
    >
      <v-card-item v-for="(item, index) in store.cart">
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
          <div class="absolute box">
            <v-checkbox
              v-model="item.selected"
              @change="onItemChange(index)"
            ></v-checkbox>
          </div>
          <div class="">
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

          <div class="">
            <h4 class="text-center font-base">Size</h4>
            <div>
              <h5 class="text-center font-500">{{ item.size }}</h5>
            </div>
          </div>
          <div>
            <h4 class="text-center font-base">Price</h4>
            <div>
              <h5 class="text-center font-500">
                {{ store.formatCurrency(store.singlePrice[index]) }}
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
                @click="item.quantity++"
              ></v-icon>
            </div>
          </div>
        </div>
      </v-card-item>
    </v-card>
    <v-card
      class="d-flex align-center justify-space-between px-5"
      variant="outlined"
      :class="$vuetify.display.mdAndUp ? 'mx-10' : ''"
    >
      <div class="flex-1-1">
        <v-checkbox
          label="Select All"
          class="mt-6"
          v-model="store.selectAll"
          @change="onSelectAllChange()"
        >
        </v-checkbox>
      </div>
      <div class="d-flex flex-column align-center mr-6">
        <h4>Total Price</h4>
        <h5>{{ store.formatCurrency(store.cartTotal) }}</h5>
      </div>
      <Checkout />
    </v-card>
  </div>
</template>
<script setup>
import { useMyCart } from "~/stores/myCart"
const store = useMyCart()

const isAllSelect = () => {
  return store.cart.every((item) => item.selected)
}

const updateSelectAll = () => {
  store.selectAll = isAllSelect()
}

const onSelectAllChange = () => {
  store.cart.forEach((item) => (item.selected = store.selectAll))
}

const onItemChange = (index) => {
  if (!store.cart[index].selected) store.selectAll = false
  else updateSelectAll()
}

onMounted(() => {
  watch(
    store.cart,
    () => {
      updateSelectAll()
    },
    { deep: true }
  )
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

.box {
  top: -16px;
  left: -10px;
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
</style>
