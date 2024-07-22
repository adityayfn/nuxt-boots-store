import { getAuth } from "firebase/auth"
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
  
} from "firebase/firestore"
import { defineStore } from "pinia"

import { useToast } from "vue-toastification"
import { useMyAuth } from "./myAuth"

export const useMyCart = defineStore("myCart", {
  state: () => ({
    carts: [],
    qty: 1,
    selectedSize: null,
    selectedColor: null,
    selected: false,
    selectAll: false,   
    dialog: false,
    snapToken: null,
  }),
  actions: {
    async addToCart(product) {
      const toast = useToast()

      const auth = getAuth()
      const uid = getAuth().currentUser.uid
      const nuxt = useNuxtApp()
      const userDoc = doc(nuxt.$db, "users", uid)

      if (auth.currentUser == null) {
        toast.error("You must login first")
        this.selectedColor = null
        this.selectedSize = null
      } else if (this.selectedColor == null && this.selectedSize == null) {
        toast.error("Please choose the variant and size")
      } else if (this.selectedColor == null) {
        toast.error("Please choose the variant")
      } else if (this.selectedSize == null) {
        toast.error("Please choose the size")
      } else {
        const cartsFirestore = await fetchFirestoreDatas()
        const cartsDoc = cartsFirestore.carts

        const existingProduct = cartsDoc?.find(
          (item) =>
            item.id === product.id &&
            item.size === this.selectedSize &&
            item.color === this.selectedColor
        )

        if (existingProduct) {
          const updatedCarts = cartsDoc.map((item) => {
            if (
              item.id === product.id &&
              item.size === this.selectedSize &&
              item.color === this.selectedColor
            ) {
              const newQty = item.quantity + 1
              const newPrice = product.price * newQty
              return {
                ...item,
                quantity: newQty,
                price: newPrice,
              }
            } else {
              return item
            }
          })

          await updateDoc(userDoc, { carts: updatedCarts })
          this.selectedColor = null
          this.selectedSize = null
          toast.success("Success add same variant to carts")
        } else {
          await updateDoc(userDoc, {
            carts: arrayUnion({
              id: product.id,
              name: product.name,
              size: this.selectedSize,
              color: this.selectedColor,
              price: product.price,
              quantity: this.qty,
              selected: this.selected,
              originalPrice: product.price,
            }),
          })
          this.selectedColor = null
          this.selectedSize = null
          toast.success("Success add product to carts")
        }
      }
    },

    async addQty(item) {
      const nuxt = useNuxtApp()
      const userDocRef = doc(nuxt.$db, "users", getAuth().currentUser.uid)

      const cartsDoc = await fetchFirestoreDatas()

      const updatedCarts = cartsDoc.carts
        .map((cartItem) => {
          if (
            cartItem.id === item.id &&
            cartItem.size === item.size &&
            cartItem.color === item.color
          ) {
            const newQty = cartItem.quantity + 1

            return {
              ...cartItem,
              quantity: newQty,
              price: cartItem.originalPrice * newQty,
            }
          } else {
            return cartItem
          }
        })
        .filter((cartItem) => cartItem.quantity > 0)
      await updateDoc(userDocRef, { carts: updatedCarts })
    },
    async deleteItem(item) {
      const nuxt = useNuxtApp()
      const userDocRef = doc(nuxt.$db, "users", getAuth().currentUser.uid)

      const cartsDoc = await fetchFirestoreDatas()

      const updatedCarts = cartsDoc.carts
        .map((cartItem) => {
          if (
            cartItem.id === item.id &&
            cartItem.size === item.size &&
            cartItem.color === item.color
          ) {
            const newQty = cartItem.quantity > 1 ? cartItem.quantity - 1 : 0

            return {
              ...cartItem,
              quantity: newQty,
              price: cartItem.originalPrice * newQty,
            }
          } else {
            return cartItem
          }
        })
        .filter((cartItem) => cartItem.quantity > 0)
      await updateDoc(userDocRef, { carts: updatedCarts })
    },
    async removeSelectedItems() {
      const nuxt = useNuxtApp()
      const auth = getAuth()
      const userDoc = doc(nuxt.$db, "users", auth.currentUser.uid)

      const userCarts = (await getDoc(userDoc)).data().carts

      const updatedCarts = userCarts.filter((item) => !item.selected)

      await updateDoc(userDoc, {
        carts: updatedCarts,
      })
    },
    async updateUsersOrder(res, data) {
      const uid = getAuth().currentUser.uid
      const nuxt = useNuxtApp()
      const userDoc = doc(nuxt.$db, "users", uid)

      const details_order = {
        order_id: res.order_id,
        gross_amount: parseInt(res.gross_amount) / 16195,
        payment_type: res.payment_type,
        transaction_status: res.transaction_status,
        items: data.items,
        transaction_time: res.transaction_time,
        va_numbers: res.va_numbers,
      }

      await updateDoc(userDoc, {
        orders: arrayUnion(details_order),
      })
    },
    async checkout(checkoutedItems) {
      const storeAuth = useMyAuth()
      const toast = useToast()
      const userProfile = await storeAuth.getProfile()

      const DATA_CHECKOUT = {
        customer: userProfile,
        items: checkoutedItems,
      }

      const { data } = await useFetch("/tokenizer", {
        method: "post",
        body: JSON.stringify(DATA_CHECKOUT),
      })

      const removeItem = () => this.removeSelectedItems()

      const updateUsers = (res, item) => {
        this.updateUsersOrder(res, item)
      }

      window.snap.pay(data.value.token, {
        onSuccess: async function (res) {
          updateUsers(res, DATA_CHECKOUT)
          console.log(res)
          removeItem()
          toast.success("Checkout Success")
        },
        onPending: async function (res) {
          updateUsers(res, DATA_CHECKOUT)
          console.log(res)
          removeItem()
          toast.warning("Checkout Pending")
        },
        onError: async function (res) {
          console.log(res)
          toast.error("Checkout Error")
        },
        onClose: async function (res) {},
      })
    },
    async refreshPaymentStatus(orderId) {
      const uid = getAuth().currentUser.uid
      const nuxt = useNuxtApp()
      const userDoc = doc(nuxt.$db, "users", uid)
      const toast = useToast()

      const { data } = await useFetch("/order-status", {
        method: "post",
        body: JSON.stringify({ orderId }),
      })

      const users = await getDoc(userDoc)

      const exchangeRate = 16195

      if (users.exists()) {
        const orders = users.data().orders
        const orderToUpdate = orders.find(
          (item) => item.order_id == data.value.order_id
        )
        if (data.value.transaction_status == "pending") {
          toast.warning("Your order is still pending")
        } else {
          if (orderToUpdate) {
            await updateDoc(userDoc, {
              orders: arrayRemove(orderToUpdate),
            })
          }

          const updateOrderStatus = {
            ...orderToUpdate,
            transaction_status: data.value.transaction_status,
            gross_amount: data.value.gross_amount / exchangeRate,
          }

          await updateDoc(userDoc, {
            orders: arrayUnion(updateOrderStatus),
          })
          toast.success("Success, Your payment status has been updated")
        }
      } else {
        console.log("data doesn't exist")
      }
    },
  },
  getters: {
    cartTotal() {
      let sum = 0

      const isSelect = this.carts.filter((item) => item.selected)

      for (let i = 0; i < isSelect.length; i++) {
        sum += isSelect[i].originalPrice * isSelect[i].quantity
      }
      return sum
    },
  },
})
