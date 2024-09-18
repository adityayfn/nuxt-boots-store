<template>
  <section class="mt-4">
    <OrganismHero :datas="props.datas" />
    <h1 class="text-center mt-3">SHOP NEW ARRIVALS</h1>
    <keep-alive>
      <OrganismItems :datas="props.datas.slice(0, 6)" />
    </keep-alive>

    <OrganismMyswiper
      :datas="props.datas"
      :modules="[SwiperNavigation, SwiperPagination, SwiperAutoplay]"
      :slides_per_view="$vuetify.display.xs ? 1 : $vuetify.display.sm ? 3 : 4"
    />
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

console.log(props.datas)
</script>
