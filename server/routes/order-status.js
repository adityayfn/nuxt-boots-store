import Midtrans from "midtrans-client"

const config = useRuntimeConfig()

let snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: config.serverKey,
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const order = await snap.transaction.status(body.orderId)

  return order
})
