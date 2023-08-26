<template>
  <div class="mt-4">
    <Hero />
    <h1 class="text-center">FOR WOMEN</h1>
    <keep-alive>
      <Items :datas="womens" />
    </keep-alive>
    <Gallery :datas="datas" />
    <Banner />
    <Footer />
  </div>
</template>
<script setup>
const props = defineProps(["datas"])

const womens = computed(() => {
  return props.datas.filter((women) => women.sex === "women")
})
</script>
<style>
.h-screen {
  height: 100vh;
}
</style>
