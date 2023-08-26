<template>
  <v-container class="">
    <div
      class="mt-10 d-flex justify-center"
      :class="$vuetify.display.sm ? 'flex-column' : 'flex-row'"
      v-for="data in props.datas"
    >
      <v-card
        class="d-flex flex-wrap my-2"
        :class="$vuetify.display.mdAndUp ? 'mr-4' : 'mr-0'"
        :width="$vuetify.display.sm ? full : 650"
      >
        <div v-for="img in data.imgDetails" class="mx-auto">
          <v-img
            :src="img"
            :width="$vuetify.display.sm ? 150 : 280"
            class="py-6"
          ></v-img>
        </div>
      </v-card>
      <v-card
        :width="$vuetify.display.sm ? full : 450"
        class="px-3 py-2 my-2"
        :class="$vuetify.display.mdAndUp ? 'ml-4' : 'ml-0'"
        :height="$vuetify.display.sm ? auto : 700"
      >
        <div class="mb-2">
          <div class="d-flex flex-column my-2">
            <h2>{{ data.name }}</h2>
            <h2>{{ store.formatCurrency(data.price) }}</h2>
          </div>

          <p>{{ data.description }}</p>
        </div>

        <div class="mb-2">
          <h3>Variant:</h3>
          <div class="d-flex">
            <div v-for="(color, key) in data.colors" class="mx-2">
              <p>{{ key.toUpperCase() }}</p>
              <v-img
                :src="color"
                :width="store.selectedColor === color ? 70 : 80"
                @click="addColor(color)"
              ></v-img>
            </div>
          </div>
        </div>
        <div class="mb-5">
          <Size :size="data.size" />
        </div>

        <v-alert
          v-if="store.alert != null"
          :type="store.alertType"
          :title="store.alertTitle"
          :text="store.alertMessage"
        ></v-alert>

        <div class="d-flex my-5">
          <v-btn color="yellow" size="large" @click="store.addToCart(data)"
            >Add To Cart</v-btn
          >
        </div>
      </v-card>
    </div>
  </v-container>
</template>
<script setup>
import { useMyCart } from "~/stores/myCart"
const props = defineProps(["datas", "error"])

const store = useMyCart()

const addColor = (color) => {
  store.selectedColor = color
  setTimeout(() => {
    store.selectedColor = null
  }, 7000)
}
</script>
<style>
.price {
  position: absolute;
  bottom: 10px;
}
</style>
