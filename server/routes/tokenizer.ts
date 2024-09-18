import Midtrans from "midtrans-client"
import { CartType } from "~/interface"
import { DataCheckout } from "~/types"

const config = useRuntimeConfig()

let snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: config.serverKey,
})

export default defineEventHandler(async (event) => {
  const datas: DataCheckout = await readBody(event)

  let itemDetails: CartType[] = []
  let grossAmount = 0

  if (!Array.isArray(datas.items) || datas.items.length === 0) {
    return sendError(
      event,
      createError({
        statusCode: 400, // Bad Request
        statusMessage: "No items found in the checkout data",
      })
    )
  }
  datas.items.map((data) => {
    const item = {
      id: data.id,
      name: data.name,
      size: data.size,
      image: data.color,
      price: data.originalPrice,
      quantity: data.quantity,
    }

    itemDetails.push(item)
    grossAmount += item.price! * item.quantity!
  })

  let parameter = {
    item_details: itemDetails,
    transaction_details: {
      order_id: 333 * Date.now(),
      gross_amount: grossAmount,
    },
    customer_details: {
      billing_address: {
        first_name: datas.customer.name,
        email: datas.customer.email,
        address: datas.customer.address,
      },
    },
  }

  const token: string = await snap.createTransactionToken(parameter)
  return { parameter, token }
})
