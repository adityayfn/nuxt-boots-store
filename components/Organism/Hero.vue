<template>
  <v-container class="">
    <v-row no-gutters justify="center" align="center">
      <v-col cols="12" sm="6">
        <v-sheet class="pa-2 ma-2">
          <h1>Discover Our Vintage Shoes Collection</h1>
          <p>
            Dr. Martens’ appeal to people who have their own individual style
            but share a united spirit – authentic characters who stand for
            something. People who possess a proud sense of self- expression.
            People who are different.
          </p>
          <v-btn class="my-4" color="yellow" @click="router.push('/products')"
            >Shop Now</v-btn
          >
        </v-sheet>
      </v-col>
      <v-col cols="12" sm="6">
        <v-sheet class="pa-2 ma-2">
          <OrganismMyswiper
            :datas="props.datas"
            :modules="[SwiperNavigation, SwiperPagination, SwiperAutoplay]"
            :slides_per_view="1"
            :height="$vuetify.display.mdAndUp ? '550' : 'auto'"
          />
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const props = defineProps(["datas"])
const router = useRouter()
</script>

<style scoped>
.img-hero {
  width: 300px;
  height: 400px;
}
.hero-image {
  width: 600px;
  height: 400px;
}
</style>
