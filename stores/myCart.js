import { defineStore } from "pinia"

import { useToast } from "vue-toastification"

export const useMyCart = defineStore("myCart", {
  state: () => ({
    cart: [],
    qty: 1,
    selectedSize: null,
    selectedColor: null,
    selected: false,
    selectAll: false,
    form: {
      fullname: "",
      email: "",
      address: "",
      payment: "",
    },
    dialog: false,
  }),
  actions: {
    addToCart(product) {
      if (this.selectedColor == null && this.selectedSize == null) {
        this.alert = true
        setTimeout(() => {
          this.alert = null
        }, 2000)
        this.alertTitle = "Failed"
        this.alertType = "error"
        this.alertMessage = "please choose the variant and size"
      } else if (this.selectedColor == null) {
        this.alert = true
        setTimeout(() => {
          this.alert = null
        }, 2000)
        this.alertTitle = "Failed"
        this.alertType = "error"
        this.alertMessage = "please choose the variant"
      } else if (this.selectedSize == null) {
        this.alert = true
        setTimeout(() => {
          this.alert = null
        }, 2000)
        this.alertTitle = "Failed"
        this.alertType = "error"
        this.alertMessage = "please choose the size "
      } else {
        const existingProduct = this.cart.find(
          (item) =>
            item.id === product.id &&
            item.size === this.selectedSize &&
            item.color === this.selectedColor
        )
        if (existingProduct) {
          existingProduct.quantity += this.qty
        } else
          this.cart.push({
            id: product.id,
            name: product.name,
            size: this.selectedSize,
            color: this.selectedColor,
            price: product.price,
            quantity: this.qty,
            selected: this.selected,
          })
        this.alert = true
        setTimeout(() => {
          this.alert = null
        }, 2000)
        this.alertTitle = "Success"
        this.alertType = "success"
        this.alertMessage = "successfully add to card "
        this.selectedColor = null
        this.selectedSize = null
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("en-Us", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 3,
      }).format(value)
    },
    deleteItem(item) {
      const index = this.cart.findIndex((product) => product.id === item.id)

      if (item.quantity > 1) item.quantity--
      else if (index !== -1) this.cart.splice(index, 1)
    },
    checkout() {
      const toast = useToast()

      const isSelect = this.cart.filter((item) => item.selected == true)
      if (isSelect.length <= 0) {
        this.dialog = false
        toast.error("Please choose item first")
      } else if (
        this.form.fullname == "" ||
        this.form.email == "" ||
        this.form.address == "" ||
        this.form.payment == ""
      ) {
        this.dialog = false
        toast.error("Please fill out all fields")
      } else {
        Object.assign(this.form, {
          fullname: "",
          email: "",
          address: "",
          payment: "",
        })
        this.dialog = false
        toast.success("Checkout Success")

        this.cart = this.cart.filter((item) => !item.selected)
        this.selectAll = false
      }
    },
  },
  getters: {
    singlePrice() {
      let total = {}

      this.cart.forEach((item, index) => {
        total[index] = item.price * this.cart[index].quantity
      })
      return total
    },
    cartTotal() {
      let sum = 0

      const isSelect = this.cart.filter((item) => item.selected)

      for (let i = 0; i < isSelect.length; i++) {
        sum += isSelect[i].price * isSelect[i].quantity
      }
      return sum
    },
  },
})
