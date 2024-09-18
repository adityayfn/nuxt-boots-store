import type { User, UserCredential } from "firebase/auth"

export interface MyAuthStoreType {
  name: string | null
  username: string | null
  email: string | null
  password: string | null
  userRef: UserCredential | User | null
  usernameAvailable: boolean | null
  newUsername: string | null
  address: string | null
  userProfile: any
  modalOpen: boolean
}

export interface MyCartStoreType {
  carts: CartType[]
  qty: number | null
  selectedSize: string | null
  selectedColor: string | null
  selected: boolean
  selectAll: boolean
  dialog: boolean
  snapToken: string | null
}

export interface ProductType {
  id: string
  name?: string
  description?: string
  price?: string | number
  sex?: string
  size?: string[]
  imgThumb?: string
  imgDetails?: string[]
  hover?: string
  colors?: any
}

export interface CartType extends ProductType {
  color?: string
  quantity?: number
  originalPrice?: number
  selected?: boolean
}
