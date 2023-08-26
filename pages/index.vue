<template>
  <div class="mt-4">
    <Hero />
    <h1 class="text-center mt-3">SHOP NEW ARRIVALS</h1>
    <keep-alive>
      <Items :datas="props.datas" />
    </keep-alive>
    <Gallery :datas="props.datas" />
    <Banner />
    <Footer />
  </div>
</template>
<script setup>
const props = defineProps(["datas"])
</script>
