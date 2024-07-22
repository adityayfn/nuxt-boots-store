<template>
  <footer class="mt-8">
    <div class="px-4 py-2 text-gray text-center w-100">
      {{ new Date().getFullYear() }} — <strong>Dr Martens Store</strong>
    </div>
  </footer>
</template>
<script setup></script>
<style scoped>
.text-gray {
  color: #888;
  font-family: "Overpass", sans-serif;
}
.text-underline:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>
