<template>
  <Head>
    <Title>Dr Martens: Fake Dr Martens Store</Title>
    <Meta name="description" content="Fake Store" />
  </Head>

  <v-layout class="rounded rounded-md">
    <v-app-bar class="py-2 px-8" color="#000000">
      <nuxt-link to="/">
        <img src="/logo.webp" alt="" style="width: 70px"
      /></nuxt-link>
      <nuxt-link to="/mens" class="link px-3">
        <h3>Mens</h3>
      </nuxt-link>
      <nuxt-link to="/womens" class="link px-3">
        <h3>Womens</h3>
      </nuxt-link>
      <v-spacer></v-spacer>
      <v-card color="yellow" class="py-1">
        <BtnCart />
      </v-card>
    </v-app-bar>

    <v-main class="" style="">
      <div v-if="loading">
        <Loading />
      </div>
      <div v-else>
        <NuxtPage :datas="datas" />
      </div>
    </v-main>
  </v-layout>
</template>
<script setup>
const { datas, error, loading, fetchData } = useDatas()
fetchData()

// useHead({
//   title: "Dr Martens: Fake Dr Martens Store",
//   meta: [
//     {
//       name: "description",
//       content: "Fake Store",
//     },
//   ],
// })
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Oswald:wght@200;400;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Overpass:wght@100;400;700&display=swap");
* {
  font-family: "Oswald", sans-serif;
}
.h-screen {
  height: 100vh;
}
.link {
  text-decoration: none;
  color: #fff;
}
.link:hover {
  color: yellow;
}
.mdi-cart {
  font-size: 1.7rem;
}
.cursor-pointer {
  cursor: pointer;
}
.c {
  border: 1px solid black;
  position: relative;
}
.absolute {
  position: absolute;
}
.relative {
  position: relative;
}
.font-500 {
  font-weight: 500;
}
</style>
