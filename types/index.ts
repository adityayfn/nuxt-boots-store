import type { CartType } from "~/interface"

type VaNumbers = {
  bank: string
  va_number: string
}

export type CheckoutResponse = {
  finish_redirect_url: string
  fraud_status: string
  gross_amount: string
  order_id: string
  payment_type: string
  status_code: string
  status_message: string
  transaction_id: string
  transaction_time: string
  transaction_status: string
  pdf_url: string
  va_numbers: VaNumbers[]
}

export type OrderType = {
  order_id: string
  gross_amount: number
  payment_type: string
  transaction_status: string
  transaction_time: string
  va_numbers: VaNumbers[]
  items?: CartType
}

export type CustomerType = {
  id: string
  name: string
  email: string
  username: string
  address: string
  carts: CartType[]
  orders: OrderType
  createdAt: {
    nanoseconds: number
    seconds: number
  }
}

export type DataCheckout = {
  customer: CustomerType
  items: CartType | CartType[]
}
