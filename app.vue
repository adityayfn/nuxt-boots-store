<template>
  <Head>
    <Title>Dr Martens: Fake Dr Martens Store</Title>
    <Meta name="description" content="Fake Store" />
  </Head>

  <NuxtLayout>
    <div v-if="load">
      <Loading />
    </div>
    <div v-else>
      <keep-alive>
        <NuxtPage :datas="datas" />
      </keep-alive>
    </div>
  </NuxtLayout>
</template>
<script setup>
definePageMeta({
  middleware: ["auth"],
})
import { useMyAuth } from "~/stores/myAuth"
const { datas, fetchData } = useDatas()

const load = ref(true)

const store = useMyAuth()

const addScriptMidtrans = () => {
  const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js"
  const config = useRuntimeConfig()

  const script = document.createElement("script")
  script.src = snapScript
  script.setAttribute("data-client-key", config.public.clientKey)
  script.async = true
  document.body.appendChild(script)
}
const removeScript = () => {
  if (script) {
    document.body.removeChild(script)
  }
}

onMounted(() => {
  fetchData()
  store.loadUser()
  setTimeout(() => {
    load.value = false
  }, 1200)

  addScriptMidtrans()
})
onBeforeUnmount(() => {
  removeScript()
})
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
