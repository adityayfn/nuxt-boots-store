<template>
  <div v-for="item in product">
    <Head>
      <Title>{{ item.name }}</Title>
      <Meta name="description" content="Fake Store" />
    </Head>
  </div>

  <div class="mt-5">
    <div v-if="loading">
      <Loading />
    </div>
    <div v-else>
      <OrganismItemDetailsXs :datas="product" v-if="$vuetify.display.xs" />
      <OrganismItemDetails
        :datas="product"
        v-if="$vuetify.display.smAndUp"
        :breadcrumbs="route.params.id[1]"
      />
    </div>
  </div>
</template>
<script setup>
definePageMeta({
  middleware: ["auth"],
})
const { datas, fetchData } = useDatas()
const route = useRoute()
const loading = ref(true)

onMounted(async () => {
  await fetchData()
  setTimeout(() => {
    loading.value = false
  }, 1200)
})

const product = computed(() => {
  return datas.value.filter((data) => data.id === route.params.id)
})
</script>
<style>
.mb-20 {
  margin-bottom: 3rem;
}
</style>
