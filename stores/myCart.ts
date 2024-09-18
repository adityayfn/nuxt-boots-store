import { getAuth } from "firebase/auth"
import {
  arrayRemove,
  arrayUnion,
  doc,
  Firestore,
  getDoc,
  updateDoc,
} from "firebase/firestore"
import { defineStore } from "pinia"

import { useToast } from "vue-toastification"
import { useMyAuth } from "./myAuth"
import type { CartType, MyCartStoreType, ProductType } from "~/interface/"
import type { CheckoutResponse, DataCheckout, OrderType } from "~/types"

export const useMyCart = defineStore("myCart", {
  state: (): MyCartStoreType => ({
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
    async addToCart(product: ProductType) {
      const toast = useToast()
      const auth = getAuth()
      const nuxt = useNuxtApp()
      const db = nuxt.$db as Firestore

      if (auth.currentUser == null) {
        this.selectedColor = null
        this.selectedSize = null
        return toast.error("You must login first")
      }

      const uid = auth.currentUser.uid
      const userDoc = doc(db, "users", uid)

      if (this.selectedColor == null && this.selectedSize == null) {
        toast.error("Please choose the variant and size")
      } else if (this.selectedColor == null) {
        toast.error("Please choose the variant")
      } else if (this.selectedSize == null) {
        toast.error("Please choose the size")
      } else {
        const cartsFirestore = await fetchFirestoreDatas()
        const cartsDoc: CartType[] = cartsFirestore?.carts

        const existingProduct = cartsDoc?.find(
          (item) =>
            item.id === product.id &&
            item.size?.includes(this.selectedSize as string) && // Cek apakah selectedSize ada di array size
            item.color === this.selectedColor
        )

        if (existingProduct) {
          const updatedCarts = cartsDoc.map((item) => {
            if (
              item.id === product.id &&
              item.size?.includes(this.selectedSize as string) &&
              item.color === this.selectedColor
            ) {
              const validPrice =
                product.price !== undefined ? Number(product.price) : 0

              const newQty = item.quantity! + 1
              const newPrice = validPrice * newQty
              return {
                ...item,
                quantity: newQty,
                price: newPrice,
              }
            } else {
              console.log(item)
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

    async addQty(item: CartType) {
      const nuxt = useNuxtApp()
      const auth = getAuth()
      const uid = auth?.currentUser?.uid as string
      const db = nuxt.$db as Firestore
      const userDocRef = doc(db, "users", uid)

      const cartsDoc = await fetchFirestoreDatas()

      const updatedCarts = cartsDoc?.carts
        .map((cartItem: CartType) => {
          if (
            cartItem.id === item.id &&
            cartItem.size === item.size &&
            cartItem.color === item.color
          ) {
            const newQty = cartItem.quantity! + 1

            return {
              ...cartItem,
              quantity: newQty,
              price: cartItem.originalPrice! * newQty,
            }
          } else {
            return cartItem
          }
        })
        .filter((cartItem: CartType) => cartItem.quantity! > 0)
      await updateDoc(userDocRef, { carts: updatedCarts })
    },
    async deleteItem(item: CartType) {
      const nuxt = useNuxtApp()
      const auth = getAuth()
      const uid = auth.currentUser?.uid as string
      const db = nuxt.$db as Firestore
      const userDocRef = doc(db, "users", uid)

      const cartsDoc = await fetchFirestoreDatas()

      const updatedCarts = cartsDoc?.carts
        .map((cartItem: CartType) => {
          if (
            cartItem.id === item.id &&
            cartItem.size === item.size &&
            cartItem.color === item.color
          ) {
            const newQty = cartItem.quantity! > 1 ? cartItem.quantity! - 1 : 0

            return {
              ...cartItem,
              quantity: newQty,
              price: cartItem.originalPrice! * newQty,
            }
          } else {
            return cartItem
          }
        })
        .filter((cartItem: CartType) => cartItem.quantity! > 0)
      await updateDoc(userDocRef, { carts: updatedCarts })
    },
    async removeSelectedItems() {
      const nuxt = useNuxtApp()
      const auth = getAuth()
      const uid = auth.currentUser?.uid as string
      const db = nuxt.$db as Firestore

      const userDoc = doc(db, "users", uid)

      const userCarts = (await getDoc(userDoc)).data()?.carts

      const updatedCarts = userCarts.filter((item: CartType) => !item.selected)

      await updateDoc(userDoc, {
        carts: updatedCarts,
      })
    },
    async updateUsersOrder(res: CheckoutResponse, data: DataCheckout) {
      const auth = getAuth()
      const uid = auth.currentUser?.uid as string
      const nuxt = useNuxtApp()
      const db = nuxt.$db as Firestore
      const userDoc = doc(db, "users", uid)

      const details_order = {
        order_id: res.order_id,
        gross_amount: parseInt(res.gross_amount),
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
    async checkout(checkoutedItems: CartType[]) {
      const storeAuth = useMyAuth()
      const toast = useToast()
      const userProfile = await storeAuth.getProfile()

      if (userProfile.address == undefined) {
        return toast.error("Please add your address in profile")
      }

      const DATA_CHECKOUT: DataCheckout = {
        customer: userProfile,
        items: checkoutedItems,
      }

      const { data, status } = await useFetch("/tokenizer", {
        method: "post",
        body: JSON.stringify(DATA_CHECKOUT),
      })

      if (status.value === "error") {
        toast.error(
          "Make sure you has been selected at least 1 items for checkout"
        )
      }

      const removeItem = () => this.removeSelectedItems()

      const updateUsers = (res: CheckoutResponse, item: DataCheckout) => {
        this.updateUsersOrder(res, item)
      }

      window.snap.pay(data.value!.token, {
        onSuccess: async function (res: CheckoutResponse) {
          updateUsers(res, DATA_CHECKOUT)

          removeItem()
          toast.success("Checkout Success")
        },
        onPending: async function (res: CheckoutResponse) {
          updateUsers(res, DATA_CHECKOUT)

          removeItem()
          toast.warning("Checkout Pending")
        },
        onError: async function (res: CheckoutResponse) {
          toast.error("Checkout Error")
        },
        onClose: async function (res: CheckoutResponse) {},
      })
    },
    async refreshPaymentStatus(orderId: string) {
      const auth = getAuth()
      const uid = auth.currentUser?.uid as string
      const nuxt = useNuxtApp()
      const db = nuxt.$db as Firestore
      const userDoc = doc(db, "users", uid)
      const toast = useToast()

      const { data } = await useFetch("/order-status", {
        method: "post",
        body: JSON.stringify({ orderId }),
      })

      const users = await getDoc(userDoc)

      if (users.exists()) {
        const orders = users.data().orders
        const orderToUpdate = orders.find(
          (item: OrderType) => item.order_id == data.value.order_id
        )
        console.log(orderToUpdate)
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
            gross_amount: data.value.gross_amount,
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

      const isSelect = this.carts.filter(
        (item: CartType) => item.selected
      ) as CartType[]

      for (let i = 0; i < isSelect.length; i++) {
        sum += isSelect[i].originalPrice! * isSelect[i].quantity!
      }
      return sum
    },
  },
})
