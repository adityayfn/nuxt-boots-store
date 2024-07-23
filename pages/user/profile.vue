<template>
  <section class="mt-10 mx-4">
    <p class="text-h4 text-center my-4">Profile Page</p>
    <v-row>
      <v-col cols="12" md="5">
        <v-card
          class="relative"
          prepend-icon="mdi-account"
          :title="profiles?.username"
        >
          <div class="d-flex flex-column">
            <v-text class="px-4"> Name: {{ profiles?.name }} </v-text>
            <v-text class="px-4"> Email: {{ profiles?.email }} </v-text>
            <v-text class="px-4"> Address: {{ profiles?.address }} </v-text>
          </div>
          <OrganismModalEditProfile title="Edit Profile">
            <div class="relative">
              <AtomsInput
                v-model="storeAuth.newUsername"
                :counter="50"
                :rules="newUsernameRules"
                label="New Username"
                type="text"
              />

              <v-btn
                color="yellow"
                class="absolute check"
                @click="storeAuth.checkUsername()"
                >Check</v-btn
              >
            </div>
            <AtomsInput
              v-model="storeAuth.address"
              :counter="50"
              :rules="addressRules"
              label="Address"
              type="text"
            />
            <v-btn color="green" @click="storeAuth.editProfile()">Save</v-btn>
          </OrganismModalEditProfile>
        </v-card>
      </v-col>
      <v-col cols="12" md="7">
        <v-card color="black">
          <v-card-title class="text-center justify-center">
            <h1 class="font-weight-bold text-h6">Order Status</h1>
          </v-card-title>

          <v-tabs v-model="tab" :color="tabColor" grow>
            <v-tab
              v-for="item in items"
              :key="item.value"
              :text="item.text"
              :value="item.value"
            ></v-tab>
          </v-tabs>

          <v-tabs-window v-model="tab">
            <v-tabs-window-item
              v-for="item in items"
              :key="item.text"
              :value="item.value"
            >
              <v-card>
                <v-card-text>
                  <v-table height="350px" fixed-header>
                    <thead>
                      <tr>
                        <th class="text-center">ORDER ID</th>
                        <th class="text-center">AMOUNT</th>
                        <th class="text-center">TYPE</th>
                        <th class="text-center">VIRTUAL ACCOUNT</th>
                        <th class="text-center">ITEMS</th>
                        <th class="text-center" v-if="item.value == 'pending'">
                          ACTION
                        </th>
                        <th class="text-center" v-if="item.value == 'pending'">
                          EXPIRED DATE
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(data, index) in filteredStatus">
                        <td class="text-center">{{ data?.order_id }}</td>
                        <td class="text-center">
                          {{ formatCurrency(data?.gross_amount, "USD") }}
                        </td>

                        <td class="text-center">
                          {{
                            data?.payment_type.replace(/_/g, " ").toUpperCase()
                          }}
                        </td>

                        <td class="text-center">
                          {{ data?.va_numbers[0].bank.toUpperCase() }}
                          {{ data?.va_numbers[0].va_number }}
                        </td>

                        <td class="text-center">
                          <div @click="getItemsDetails(data.order_id)">
                            <OrganismCheckItems :datas="detailsOrderById" />
                          </div>
                        </td>
                        <td class="text-center" v-if="item.value == 'pending'">
                          <v-btn
                            size="small"
                            @click="
                              storeCarts.refreshPaymentStatus(data.order_id)
                            "
                            color="green"
                            >Refresh Status</v-btn
                          >
                        </td>
                        <td class="text-center" v-if="item.value == 'pending'">
                          {{ calculateExpiryDate(data.transaction_time) }}
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-card-text>
              </v-card>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card>
      </v-col>
    </v-row>
  </section>
</template>
<script setup>
import { useMyAuth } from "@/stores/myAuth"
import { useMyCart } from "@/stores/myCart"
import { doc, onSnapshot } from "firebase/firestore"
const storeAuth = useMyAuth()
const userOrders = ref([])
const storeCarts = useMyCart()

const detailsOrderById = ref()

const items = [
  {
    text: "Success",
    value: "settlement",
  },
  {
    text: "Pending",
    value: "pending",
  },
]
const tab = ref(items[0].value)
const tabColor = ref("green")

const status = ref([])

const profiles = computed(() => {
  return storeAuth.userProfile
})

const filteredStatus = computed(() => {
  return userOrders?.value?.filter(
    (item) => item.transaction_status === tab.value
  )
})

watch(tab, (newTab) => {
  filteredStatus.value = status.value.filter(
    (data) => data.transaction_status === newTab
  )
})

watch(tab, (newTab) => {
  return newTab == "pending"
    ? (tabColor.value = "yellow")
    : (tabColor.value = "green")
})

onMounted(async () => {
  setupCartListener()
})

const uid = ref("")

const setupCartListener = () => {
  const nuxt = useNuxtApp()
  if (uid.value) {
    const userDocRef = doc(nuxt.$db, "users", uid.value)
    onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        storeAuth.userProfile = docSnapshot.data() || []
        if (docSnapshot.data().orders != undefined) {
          userOrders.value = docSnapshot.data().orders
        }
      } else {
        storeAuth.userProfile = null
      }
    })
  }
}

watch(
  () => storeAuth.userRef,
  (newUserRef, oldUserRef) => {
    if (newUserRef && newUserRef.uid !== uid.value) {
      uid.value = newUserRef.uid
      setupCartListener()
    }
  },
  { immediate: true }
)

const getItemsDetails = (orderId) => {
  const filtered = userOrders.value.filter((data) => data.order_id == orderId)

  detailsOrderById.value = filtered[0].items
}
</script>

<style scoped>
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
