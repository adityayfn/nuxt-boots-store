import { useScheduler } from "#scheduler"
import { initializeApp } from "firebase/app"
import {
  collection,
  getDocs,
  getFirestore,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore"
import { ProductType } from "~/interface"
import { CustomerType, OrderType } from "~/types"

export default defineNitroPlugin(() => {
  updateExpiredOrders()
})

async function updateExpiredOrders() {
  const config = useRuntimeConfig()
  const firebaseConfig = {
    apiKey: config.public.apiKey,
    authDomain: config.public.authDomain,
    databaseURL: config.public.databaseURL,
    projectId: config.public.projectId,
    storageBucket: config.public.storageBucket,
    messagingSenderId: config.public.messagingSenderId,
    appId: config.public.appId,
  }
  initializeApp(firebaseConfig)
  const db = getFirestore()

  const scheduler = useScheduler()

  const getUsersCollection = async (): Promise<ProductType[] | any> => {
    try {
      const res = collection(db, "users")
      const product = await getDocs(res)
      const productList = product.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
        }
      })
      return productList
    } catch (err) {
      return err
    }
  }

  const deleteExpiredOrders = async (userDocId: string, newOrders: any) => {
    const userDocRef = doc(db, "users", userDocId)
    await updateDoc(userDocRef, { orders: newOrders })
  }

  const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24

  const EXPIRED_DAY = 1

  const checkAndDeleteExpiredOrders = async (data: CustomerType) => {
    const current = new Date()

    if (Array.isArray(data.orders)) {
      const originalOrdersLength = data.orders.length
      const newOrders = data.orders.filter((order: OrderType) => {
        const trxTime = Date.parse(order.transaction_time)
        const transactionTime = new Date(trxTime)
        const timeDifference =
          (current.getTime() - transactionTime.getTime()) /
          MILLISECONDS_IN_A_DAY

        if (
          order.transaction_status === "pending" &&
          timeDifference > EXPIRED_DAY
        ) {
          return false
        } else {
          return true
        }
      })

      if (newOrders.length !== originalOrdersLength) {
        await deleteExpiredOrders(data.id, newOrders)
      } else {
        console.log("No changes in orders")
      }
    }
  }

  const datas = await getUsersCollection()

  // Listen to Firestore changes
  datas.forEach((data: CustomerType) => {
    const userDoc = doc(db, "users", data.id)
    if (data.orders != undefined) {
      onSnapshot(userDoc, async (docSnapshot) => {
        const newOrders = docSnapshot
          ?.data()
          ?.orders.filter((order: OrderType) => {
            const trxTime = Date.parse(order.transaction_time)
            const transactionTime = new Date(trxTime)
            const timeDifference =
              (new Date().getTime() - transactionTime.getTime()) /
              MILLISECONDS_IN_A_DAY

            if (
              order.transaction_status === "pending" &&
              timeDifference > EXPIRED_DAY
            ) {
              return false
            } else {
              return true
            }
          })

        if (newOrders.length !== docSnapshot?.data()?.orders.length) {
          await updateDoc(userDoc, {
            orders: newOrders,
          })
        }
      })
    }
  })

  scheduler
    .run(async () => {
      for (const data of datas) {
        await checkAndDeleteExpiredOrders(data)
      }
    })
    .everyMinutes(30)
}
