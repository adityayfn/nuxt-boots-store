<template>
  <div class="px-2 py-5">
    <h1 class="text-center">Gallery</h1>
    <Swiper
      :modules="[SwiperNavigation, SwiperPagination, SwiperAutoplay]"
      :autoplay="{
        delay: 2000,
        disableOnInteraction: true,
      }"
      :slides-per-view="$vuetify.display.xs ? 1 : $vuetify.display.sm ? 3 : 4"
      :pagination="{ clickable: true, dynamicBullets: true }"
      class=""
    >
      <SwiperSlide v-for="data in props.datas" :key="data.id">
        <v-card class="">
          <v-img :src="data.hover" :lazy-src="data.hover" alt="gallery"></v-img>
        </v-card>
      </SwiperSlide>
    </Swiper>
  </div>
</template>
<script setup>
const props = defineProps(["datas", "error"])
</script>
<style scoped></style>
