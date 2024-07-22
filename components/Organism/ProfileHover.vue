<template>
  <div class="text-center">
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn color="yellow" v-bind="props">
          <v-icon icon="mdi mdi-account" size="large" class="mr-1"></v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-for="(item, index) in items" :key="index" :value="index">
          <v-list-item-title
            class="cursor-pointer"
            @click="
              item.title === 'Logout'
                ? store.logout()
                : router.push('/user/profile')
            "
            >{{ item.title }}</v-list-item-title
          >
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>
<script setup>
import { useMyAuth } from "@/stores/myAuth"

const props = defineProps(["profile"])
const router = useRouter()
const store = useMyAuth()

const items = reactive([{ title: "Profile" }, { title: "Logout" }])
</script>
<style scoped>
.v-item:hover {
  background-color: #ffeb3b;
}
</style>
