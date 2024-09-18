<template>
  <section class="mt-10">
    <h1 class="text-center">All Products</h1>

    <v-container>
      <div class="d-flex ga-10 justify-space-between">
        <div class="w-50">
          <v-select
            label="Sort Items"
            :items="['all', 'men', 'women']"
            variant="underlined"
            v-model="selectedItems"
          ></v-select>
        </div>
        <div class="w-50">
          <v-select
            clearable
            label="Sort Price"
            :items="sortType"
            variant="underlined"
            v-model="selectedPrice"
          ></v-select>
        </div>
      </div>
    </v-container>

    <keep-alive>
      <OrganismItems :datas="filteredPrice" />
    </keep-alive>
  </section>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
})
import type { ProductType } from "../interface/"

const props = defineProps<{
  datas: ProductType[]
}>()

const selectedPrice = ref<string | null>(null)
const selectedItems = ref<string>("all")

const sortType: string[] = ["Low to High", "High to Low"]

const filteredData = computed(() => {
  if (selectedItems.value === "all") {
    return props.datas
  } else {
    return props.datas.filter((data) => data.sex === selectedItems.value)
  }
})

const filteredPrice = computed(() => {
  return filteredData.value.slice().sort((a: any, b: any) => {
    if (selectedPrice.value === "Low to High") return a.price - b.price
    else if (selectedPrice.value === "High to Low") return b.price - a.price
    return 0
  })
})
</script>
<style>
.h-screen {
  height: 100vh;
}
</style>
