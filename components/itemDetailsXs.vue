<template>
  <v-container>
    <v-card v-for="data in props.datas" :key="data.id">
      <Swiper
        :modules="[SwiperNavigation, SwiperPagination]"
        :slides-per-view="1"
        :navigation="{ clickable: true }"
        :pagination="{ clickable: true, dynamicBullets: true }"
        class=""
      >
        <SwiperSlide v-for="img in data.imgDetails">
          <v-img :src="img"></v-img>
        </SwiperSlide>
      </Swiper>
      <v-card class="px-3 py-2" height="">
        <div>
          <h3 class="my-1">{{ data.name }}</h3>
          <h3 class="my-1">{{ store.formatCurrency(data.price) }}</h3>
          <p class="my-2">{{ data.description }}</p>
        </div>
        <div class="mb-5">
          <h3>Variant:</h3>
          <div class="d-flex flex-wrap">
            <div v-for="(color, key) in data.colors" class="mx-2">
              <p>{{ key.toUpperCase() }}</p>
              <v-img
                :src="color"
                :width="store.selectedColor === color ? 70 : 80"
                @click="addColor(color)"
                alt="variant"
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
    </v-card>
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
<style scoped></style>
