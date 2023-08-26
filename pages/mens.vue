<template>
  <div class="mt-4">
    <Hero />
    <h1 class="text-center">FOR MENS</h1>
    <keep-alive>
      <Items :datas="mens" />
    </keep-alive>
    <Gallery :datas="datas" />
    <Banner />
    <Footer />
  </div>
</template>
<script setup>
const props = defineProps(["datas"])

const mens = computed(() => {
  return props.datas.filter((men) => men.sex === "men")
})
</script>
<style>
.h-screen {
  height: 100vh;
}
</style>
