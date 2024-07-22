<template>
  <div class="text-center pa-4">
    <v-btn class="pencil" @click="storeAuth.modalOpen = true" color="yellow">
      <v-icon icon="mdi-pencil" size="small"></v-icon
    ></v-btn>

    <v-dialog max-width="500" v-model="storeAuth.modalOpen">
      <v-card :title="props.title" class="relative pt-2">
        <v-card-text>
          <slot />
        </v-card-text>
        <template v-slot:actions>
          <v-icon
            class="btn-close"
            icon="mdi-window-close"
            @click="storeAuth.modalOpen = false"
            size="large"
          ></v-icon>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { useMyAuth } from "@/stores/myAuth"

const props = defineProps(["title"])
const storeAuth = useMyAuth()
</script>
<style scoped>
.btn-close {
  position: absolute;
  top: 15px;
  right: 15px;
}
.pencil {
  position: absolute;
  top: 10px;
  right: 10px;
}
.check {
  right: 10px;
  top: 10px;
}
</style>
