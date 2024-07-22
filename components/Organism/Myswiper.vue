<template>
  <Swiper
    :modules="props.modules"
    :autoplay="{
      delay: 2000,
      disableOnInteraction: true,
    }"
    :slides-per-view="props.slides_per_view"
    :pagination="{ clickable: true, dynamicBullets: true }"
    class=""
  >
    <SwiperSlide v-for="data in props.datas" :key="data.id">
      <v-card class="">
        <v-img
          :src="data.hover"
          :lazy-src="data.hover"
          alt="gallery"
          :height="props.height"
        ></v-img>
      </v-card>
    </SwiperSlide>
  </Swiper>
</template>
<script setup>
const props = defineProps(["datas", "modules", "slides_per_view", "height"])
</script>
<style lang=""></style>
