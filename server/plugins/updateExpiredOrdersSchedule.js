// import { useScheduler } from "#scheduler"
// import { initializeApp } from "firebase/app"

// import {
//   arrayUnion,
//   collection,
//   doc,
//   getDocs,
//   getFirestore,
//   onSnapshot,
//   updateDoc,
// } from "firebase/firestore"

// export default defineNitroPlugin(() => {
//   startScheduler()
// })

// async function startScheduler() {
//   const config = useRuntimeConfig()
//   const firebaseConfig = {
//     apiKey: config.public.apiKey,
//     authDomain: config.public.authDomain,
//     databaseURL: config.public.databaseURL,
//     projectId: config.public.projectId,
//     storageBucket: config.public.storageBucket,
//     messagingSenderId: config.public.messagingSenderId,
//     appId: config.public.appId,
//   }
//   initializeApp(firebaseConfig)
//   const db = getFirestore()

//   const scheduler = useScheduler()

//   const getUsersCollection = async () => {
//     try {
//       const res = collection(db, "users")
//       const product = await getDocs(res)
//       const productList = product.docs.map((doc) => {
//         return {
//           ...doc.data(),
//           id: doc.id,
//         }
//       })

//       return productList
//     } catch (err) {
//       return err
//     }
//   }

//   const datas = await getUsersCollection()

//   const current = new Date()
//   const oneDayInMilliseconds = 24 * 60 * 60 * 1000

//   const cobaAja = 1000 * 60 * 60

//   scheduler
//     .run(async () => {
//       for (const data of datas) {
//         if (data.orders != undefined) {
//           const newOrders = data.orders.filter((order) => {
//             const trxTime = Date.parse(order.transaction_time)
//             const transactionTime = new Date(trxTime)

//             const timeDifference = (current - transactionTime) / cobaAja

//             console.log(timeDifference)

//             if (order.transaction_status === "pending" && timeDifference > 1) {
//               console.log("pending order is expired")
//               return false
//             } else {
//               console.log("order valid")
//               return true
//             }
//           })

//           const userDoc = doc(db, "users", data.id)

//           onSnapshot(userDoc, async (docSnapshot) => {
//             console.log(newOrders.length, docSnapshot.data().orders.length)
//             if (newOrders.length != docSnapshot.data().orders.length) {
//               await updateDoc(userDoc, {
//                 orders: newOrders,
//               })
//               console.log("update orders users")
//             }
//           })

//           // if (newOrders.length != data.orders.length) {
//           //   const userDoc = doc(db, "users", data.id)
//           //   await updateDoc(userDoc, {
//           //     orders: newOrders,
//           //   })
//           //   console.log("update orders users")
//           // }
//         }
//       }
//     })
//     .everySeconds(60)
// }

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

  const getUsersCollection = async () => {
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

  const deleteExpiredOrders = async (userDocId, newOrders) => {
    const userDocRef = doc(db, "users", userDocId)
    await updateDoc(userDocRef, { orders: newOrders })
  }

  const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24

  const EXPIRED_DAY = 1

  const checkAndDeleteExpiredOrders = async (data) => {
    const current = new Date()
    const originalOrdersLength = data.orders.length

    const newOrders = data.orders.filter((order) => {
      const trxTime = Date.parse(order.transaction_time)
      const transactionTime = new Date(trxTime)
      const timeDifference = (current - transactionTime) / MILLISECONDS_IN_A_DAY

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

  const datas = await getUsersCollection()

  // Listen to Firestore changes
  datas.forEach((data) => {
    const userDoc = doc(db, "users", data.id)
    if (data.orders != undefined) {
      onSnapshot(userDoc, async (docSnapshot) => {
        const newOrders = docSnapshot.data().orders.filter((order) => {
          const trxTime = Date.parse(order.transaction_time)
          const transactionTime = new Date(trxTime)
          const timeDifference =
            (new Date() - transactionTime) / MILLISECONDS_IN_A_DAY

          if (
            order.transaction_status === "pending" &&
            timeDifference > EXPIRED_DAY
          ) {
            return false
          } else {
            return true
          }
        })

        if (newOrders.length !== docSnapshot.data().orders.length) {
          await updateDoc(userDoc, {
            orders: newOrders,
          })
        }
      })
    }
  })

  // Scheduler for periodic checks
  scheduler
    .run(async () => {
      for (const data of datas) {
        await checkAndDeleteExpiredOrders(data)
      }
    })
    .everyMinutes(30)
}
