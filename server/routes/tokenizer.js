import Midtrans from "midtrans-client"

const config = useRuntimeConfig()

let snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: config.serverKey,
})

export default defineEventHandler(async (event) => {
  const datas = await readBody(event)

  let itemDetails = []
  let grossAmount = 0

  const exchangeRate = 16195

  datas.items.map((data) => {
    const item = {
      id: data.id,
      name: data.name,
      size: data.size,
      image: data.color,
      price: parseInt(data.originalPrice) * exchangeRate,
      quantity: data.quantity,
    }

    itemDetails.push(item)

    grossAmount += item.price * item.quantity
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

  const token = await snap.createTransactionToken(parameter)

  return { parameter, token }
})
