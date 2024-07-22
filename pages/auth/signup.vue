<template>
  <v-container>
    <div class="d-flex flex-column ga-6 justify-center align-center h-80">
      <img src="/logo.webp" alt="" style="width: 120px" />
      <v-sheet class="mx-auto" width="300">
        <v-form ref="form">
          <AtomsInput
            v-model="store.name"
            :counter="100"
            :rules="nameRules"
            label="Name"
            type="text"
          />
          <div class="relative">
            <AtomsInput
              v-model="store.username"
              :counter="50"
              :rules="usernameRules"
              label="Username"
              type="text"
            />

            <v-btn
              color="yellow"
              class="absolute check"
              @click="store.checkUsername()"
              >Check</v-btn
            >
          </div>
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
            label="Password"
            type="password"
          />

          <div class="d-flex flex-column">
            <v-btn class="mt-4" color="yellow" block @click="signUp">
              Sign Up
            </v-btn>
          </div>
          <div class="d-flex justify-center ga-2 mt-2">
            <span>Are you member?</span>

            <span class="cursor-pointer" @click="router.push('/auth/signin')"
              >Login</span
            >
          </div>
        </v-form>
      </v-sheet>
    </div>
  </v-container>
</template>
<script setup>
definePageMeta({
  middleware: ["auth"],
})

import { useMyAuth } from "~/stores/myAuth"

const store = useMyAuth()

const router = useRouter()
const form = ref(null)

const signUp = async () => {
  const { valid } = await form.value.validate()

  if (valid) {
    store.register()
  }
}
</script>
<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.cursor-pointer:hover {
  color: #666;
}
.h-80 {
  height: 80vh;
}
.check {
  right: 10px;
  top: 10px;
}
</style>
