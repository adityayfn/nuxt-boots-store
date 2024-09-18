<template>
  <v-container>
    <div>
      <v-breadcrumbs :items="items"> </v-breadcrumbs>
    </div>
    <v-card v-for="data in props.datas" :key="data.id">
      <Swiper
        :modules="[SwiperNavigation, SwiperPagination]"
        :slides-per-view="1"
        :navigation="true"
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
          <h3 class="my-1">{{ formatCurrency(data.price, "USD") }}</h3>
          <p class="my-2">{{ data.description }}</p>
        </div>
        <div class="mb-5">
          <h3>Variant:</h3>
          <div class="d-flex flex-wrap ga-2">
            <div
              v-for="(color, key) in data.colors"
              class="mx-2"
              :class="store.selectedColor === color ? 'border-yellow' : ''"
            >
              <p class="pa-1 text-center">{{ key.toString().toUpperCase() }}</p>
              <v-img
                :src="color"
                :width="80"
                @click="addColor(color)"
                alt="variant"
              ></v-img>
            </div>
          </div>
        </div>
        <div class="mb-5">
          <OrganismSize :size="data.size" />
        </div>

        <div class="d-flex my-5">
          <v-btn color="yellow" size="large" @click="store.addToCart(data)"
            >Add To Cart</v-btn
          >
        </div>
      </v-card>
    </v-card>
  </v-container>
</template>
<script setup lang="ts">
import { useMyCart } from "~/stores/myCart"
import type { ProductType } from "@/interface/"
const props = defineProps<{
  datas: ProductType[] | any
  error: any
}>()

const store = useMyCart()

const breadcrumb = ref<ProductType>()

watch(
  () => props.datas,
  (newData) => {
    breadcrumb.value = newData.length > 0 ? newData[0] : null
    console.log(newData)
  },
  { immediate: true }
)
type Items = {
  title: any
  href: string
  disabled: boolean
}

const items: Items[] = [
  {
    title: "Home",
    href: "/",
    disabled: false,
  },
  {
    title: "Products",
    href: "/products",
    disabled: false,
  },
  {
    title: breadcrumb.value?.name,
    href: `/product/${breadcrumb.value?.id}`,
    disabled: true,
  },
]

const addColor = (color: any) => {
  store.selectedColor = color
}
</script>
<style scoped>
.border-yellow {
  border: 5px solid yellow;
  border-color: yellow;
}
</style>
