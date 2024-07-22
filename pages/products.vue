<template>
  <section class="mt-10">
    <h1 class="text-center">All Products</h1>

    <v-container>
      <v-tabs v-model="tab">
        <v-tab value="all">All</v-tab>
        <v-tab value="men">Men's</v-tab>
        <v-tab value="women">Women's</v-tab>
      </v-tabs>
    </v-container>

    <keep-alive>
      <OrganismItems :datas="tab === 'all' ? props.datas : filteredData" />
    </keep-alive>
  </section>
</template>
<script setup>
definePageMeta({
  middleware: ["auth"],
})
const tab = ref(null)
const props = defineProps(["datas"])

const filteredData = computed(() => {
  return props.datas.filter((data) => data.sex === tab.value)
})
watch(tab, (newTab) => {
  filteredData.value = props.datas.filter((data) => data.sex === newTab)
})
</script>
<style>
.h-screen {
  height: 100vh;
}
</style>
