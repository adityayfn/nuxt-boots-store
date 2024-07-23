import { getAuth } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"

export const fetchFirestoreDatas = async () => {
  const auth = getAuth()
  const nuxt = useNuxtApp()
  const uid = auth.currentUser.uid
  const userDoc = doc(nuxt.$db, "users", uid)

  const cartSnapshot = await getDoc(userDoc)
  const cartsDoc = cartSnapshot.data()

  return cartsDoc
}
export const formatCurrency = (value, curr) => {
  const locale = curr === "IDR" ? "id-ID" : "en-US"

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: curr,
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
  }).format(value)
}

export const calculateExpiryDate = (date) => {
  const orderTime = new Date(date)
  const expiryTime = new Date(orderTime.getTime() + 24 * 60 * 60 * 1000)
  return expiryTime.toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
}
