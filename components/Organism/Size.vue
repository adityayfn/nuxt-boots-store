<template>
  <v-item-group class="d-flex flex-wrap">
    <div v-for="size in props.size" class="mx-2 my-2">
      <v-item class="">
        <v-card
          :color="store.selectedSize === size ? 'yellow' : ''"
          @click="selectSize(size)"
          class="px-2"
        >
          <v-scroll-y-transition>
            <div class="flex-grow-1 text-center">
              {{ size }}
            </div>
          </v-scroll-y-transition>
        </v-card>
      </v-item>
    </div>
  </v-item-group>
</template>
<script setup>
import { useMyCart } from "~/stores/myCart"

const props = defineProps(["size"])
const store = useMyCart()

const selectSize = (size) => {
  store.selectedSize = size
}
</script>
<style></style>
