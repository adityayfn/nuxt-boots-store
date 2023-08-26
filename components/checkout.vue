<template>
  <div>
    <v-row justify="center">
      <v-dialog v-model="store.dialog" persistent width="1024">
        <template v-slot:activator="{ props }">
          <v-btn color="yellow" size="large" v-bind="props">CHECKOUT</v-btn>
        </template>
        <v-card>
          <v-card-title class="mt-4">
            <h3 class="">CHECKOUT FORM</h3>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    label="Full name*"
                    required
                    v-model="store.form.fullname"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    label="Address*"
                    required
                    v-model="store.form.address"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Email*"
                    required
                    v-model="store.form.email"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-radio-group
                label="PAYMENT METHOD*"
                v-model="store.form.payment"
              >
                <div class="d-flex">
                  <v-radio label="GOOGLE PAY" value="gpay"> </v-radio>
                  <img src="/gpay.svg" class="payment-w" />
                </div>
                <div class="d-flex">
                  <v-radio label="PAYPAL" value="paypal"></v-radio>
                  <img src="/paypal.svg" class="payment-w" />
                </div>
              </v-radio-group>
              <div class="d-flex">
                <div>
                  <h3>Total Price</h3>
                  <p>(Include Tax and Shipping)</p>
                </div>
                <div>
                  <h3 v-if="isSelect >= 1">
                    {{ store.formatCurrency(finalPrice) }}
                  </h3>
                </div>
              </div>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="black"
              class="bg-yellow"
              variant="text"
              @click="store.dialog = false"
            >
              CANCEL
            </v-btn>
            <v-btn
              color="black"
              class="bg-yellow"
              variant="text"
              @click="store.checkout()"
            >
              CHECKOUT NOW
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>
<script setup>
import { useMyCart } from "~/stores/myCart"

const store = useMyCart()

const isSelect = computed(() => {
  const items = store.cart.filter((item) => item.selected == true)
  return items.length
})

const tax = ref(0.1)
const shipping = ref(4)

const priceAfterTax = computed(() => {
  return store.cartTotal * (1 + tax.value)
})

const priceAfterShipping = computed(() => {
  return priceAfterTax.value + shipping.value
})

const finalPrice = computed(() => {
  return priceAfterShipping.value.toFixed()
})
</script>
<style>
.payment-w {
  width: 50px;
}
.max-w {
  max-width: 300px;
}
</style>
