<template>
  <v-btn size="small" @click="dialog = true" color="yellow"> Check </v-btn>

  <v-dialog v-model="dialog" width="auto">
    <v-card max-width="500" title="Item Details" class="px-5">
      <div
        v-for="item in props?.datas?.length"
        class="d-flex ga-2 mb-6"
        v-if="isSkeleton"
      >
        <v-skeleton-loader
          class="mx-auto"
          :width="$vuetify.display.smAndUp ? '100' : '70'"
          type="image"
        ></v-skeleton-loader>
        <v-skeleton-loader
          class="mx-auto"
          :width="$vuetify.display.smAndUp ? '100' : '150'"
          type="article"
        ></v-skeleton-loader>
      </div>

      <div v-for="item in props.datas" class="d-flex ga-2 flex-wrap" v-else>
        <div class="mb-3">
          <v-img
            :src="item.color"
            :width="$vuetify.display.smAndUp ? '100' : '70'"
            :lazy-src="item.color"
          />
        </div>
        <div>
          <h5>Name: {{ item.name }}</h5>
          <h5>Size: {{ item.size }}</h5>
          <h5>Qty :{{ item.quantity }}</h5>
          <h5>
            Price:
            {{ formatCurrency(item.originalPrice, "USD") }}
          </h5>
        </div>
      </div>
      <template v-slot:actions>
        <v-btn
          class="ms-auto"
          color="red"
          text="Close"
          @click="dialog = false"
        ></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
<script setup>
const props = defineProps(["datas", "dialog"])

const dialog = ref(false)
const isSkeleton = ref(true)

watch(dialog, () => {
  if (dialog.value) {
    setTimeout(() => {
      isSkeleton.value = false
    }, 1000)
    isSkeleton.value = true
  }
})
</script>
<style lang=""></style>
