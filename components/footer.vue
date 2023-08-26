<template>
  <footer class="bg-black mt-5">
    <div
      class="d-flex px-5 py-5"
      :class="$vuetify.display.xs ? 'flex-column' : 'flex-row'"
    >
      <div :class="$vuetify.display.smAndUp ? 'mx-auto' : 'mx-0'">
        <h3 class="text-underline">SIGN IN / REGISTER</h3>
        <h4 class="text-gray text-underline">STORE LOCATOR</h4>
      </div>
      <div :class="$vuetify.display.smAndUp ? 'mx-auto' : 'mx-0'">
        <h3 class="text-underline">ABOUT US</h3>
        <h4 class="text-gray text-underline">HISTORY</h4>
        <h4 class="text-gray text-underline">JOBS</h4>
        <h4 class="text-gray text-underline">BLOG</h4>
        <h4 class="text-gray text-underline">CONTACT</h4>
      </div>

      <div :class="$vuetify.display.smAndUp ? 'mx-auto' : 'mx-0'">
        <h3 class="text-underline">USEFUL INFO</h3>
        <h4 class="text-gray text-underline">SHIPPING</h4>
        <h4 class="text-gray text-underline">SIZE GUIDE</h4>
      </div>
    </div>
    <div class="d-flex w-100 align-center">
      <v-btn
        v-for="icon in icons"
        :key="icon"
        class="mx-auto"
        :icon="icon"
        variant="plain"
        size="medium"
      ></v-btn>
    </div>

    <div class="px-4 py-2 bg-black text-center w-100">
      {{ new Date().getFullYear() }} — <strong>Dr Martens Store</strong>
    </div>
  </footer>
</template>
<script setup>
const icons = reactive([
  "mdi-facebook",
  "mdi-twitter",
  "mdi-music-note",
  "mdi-instagram",
])
</script>
<style scoped>
.text-gray {
  color: #999;
  font-family: "Overpass", sans-serif;
}
.text-underline:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>
