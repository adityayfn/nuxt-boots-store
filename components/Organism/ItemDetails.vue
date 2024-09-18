<template>
  <v-container>
    <div>
      <v-breadcrumbs :items="items"> </v-breadcrumbs>
    </div>
    <div
      class="mt-10 d-flex justify-center"
      :class="$vuetify.display.sm ? 'flex-column' : 'flex-row'"
      v-for="data in props.datas"
    >
      <v-card
        class="d-flex flex-wrap my-2"
        :class="$vuetify.display.mdAndUp ? 'mr-4' : 'mr-0'"
        :width="$vuetify.display.sm ? '100%' : 650"
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
        :width="$vuetify.display.sm ? '100%' : 450"
        class="px-3 py-2 my-2"
        :class="$vuetify.display.mdAndUp ? 'ml-4' : 'ml-0'"
        :height="$vuetify.display.sm ? 'auto' : 700"
      >
        <div class="mb-2">
          <div class="d-flex flex-column my-2">
            <h2>{{ data.name }}</h2>
            <h2>{{ formatCurrency(data.price, "IDR") }}</h2>
          </div>

          <p>{{ data.description }}</p>
        </div>

        <div class="mb-2">
          <h3>Variant:</h3>
          <div class="d-flex">
            <div
              @click="addColor(color)"
              v-for="(color, key) in data.colors"
              class="mx-2 cursor-pointer"
              :class="store.selectedColor === color ? 'border-yellow' : ''"
            >
              <p class="pa-1 text-center">{{ key.toString().toUpperCase() }}</p>
              <v-img
                :src="color"
                :width="store.selectedColor === color ? 70 : 80"
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
    </div>
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
.price {
  position: absolute;
  bottom: 10px;
}
</style>
