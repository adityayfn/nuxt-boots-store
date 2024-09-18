<template>
  <v-container>
    <div class="d-flex flex-column ga-6 justify-center align-center h-80">
      <img src="/logo.webp" alt="" style="width: 120px" />
      <v-sheet class="mx-auto" width="300">
        <v-form ref="form">
          <AtomsInput
            v-model="store.email"
            :counter="50"
            :rules="emailRules"
            label="Email"
            type="email"
          />

          <AtomsInput
            v-model="store.password"
            :counter="20"
            :rules="passwordRules"
            label="password"
            type="password"
          />

          <div class="d-flex flex-column">
            <v-btn class="mt-4" color="yellow" block @click="validate">
              Sign In
            </v-btn>
          </div>
          <div class="d-flex justify-center ga-2 mt-2">
            <span>Not a member?</span>

            <span class="cursor-pointer" @click="router.push('/auth/signup')"
              >Register</span
            >
          </div>
        </v-form>
      </v-sheet>
    </div>
  </v-container>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
})
import { emailRules, passwordRules } from "@/utils/formRules"
import { getAuth } from "firebase/auth"
import { useMyAuth } from "~/stores/myAuth"

const store = useMyAuth()
const router = useRouter()
const form = ref<any | null>(null)
const auth = getAuth()

const validate = async () => {
  const { valid } = await form.value?.validate()

  if (valid) {
    store.login()
  }
}

onMounted(() => {
  auth.onAuthStateChanged((user) => {
    if (user) router.push("/")
  })
})
</script>
<style>
.cursor-pointer {
  cursor: pointer;
}
.cursor-pointer:hover {
  color: #666;
}
.h-80 {
  height: 80vh;
}
</style>
