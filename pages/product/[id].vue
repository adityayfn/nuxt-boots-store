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
      <ItemDetailsXs :datas="product" v-if="$vuetify.display.xs" />
      <ItemDetails :datas="product" v-if="$vuetify.display.smAndUp" />
    </div>
  </div>
</template>
<script setup>
const { datas, error, fetchData, loading } = useDatas()

onMounted(async () => {
  await fetchData()
})

const route = useRoute()

const product = computed(() => {
  return datas.value.filter((data) => data.id === route.params.id)
})

let title

for (let t of product.value) {
  console.log(t)
}
</script>
<style>
.mb-20 {
  margin-bottom: 3rem;
}
</style>
