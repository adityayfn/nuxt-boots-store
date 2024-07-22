<template>
  <v-container
    :class="
      route.path != '/' && $vuetify.display.mdAndUp ? 'h-screen mt-10' : ''
    "
  >
    <div class="d-flex flex-wrap">
      <div v-for="data in props.datas" :key="data.id" class="mx-auto">
        <v-hover>
          <template v-slot:default="{ isHovering, props }">
            <v-card
              width="150"
              height="300"
              class="my-2"
              v-bind="props"
              :class="$vuetify.display.xs ? 'mx-1' : 'mx-3'"
              @click="more(data.id)"
            >
              <v-img
                :src="isHovering ? data.hover : data.imgThumb"
                :lazy-src="isHovering ? data.hover : data.imgThumb"
                alt="item try on"
              ></v-img>

              <h5 class="px-2 py-1">{{ data.name }}</h5>
              <h4 class="px-2 price">
                {{ formatCurrency(data.price, "USD") }}
              </h4>
            </v-card>
          </template>
        </v-hover>
      </div>
    </div>
    <div class="d-flex justify-center mt-10" v-if="route.path == '/'">
      <v-btn color="yellow" @click="router.push('/products')"
        >Explore All Products</v-btn
      >
    </div>
  </v-container>
</template>
<script setup>
import { useMyCart } from "~/stores/myCart"
const props = defineProps(["datas", "error"])

const store = useMyCart()
const router = useRouter()
const more = (id) => {
  router.push({
    path: `/product/${id}`,
  })
}

const route = useRoute()
</script>
<style>
.price {
  position: absolute;
  bottom: 10px;
}
.h-sreen {
  min-height: 100vh;
}
</style>
