import { ref } from "vue"
import { collection, Firestore, getDocs } from "firebase/firestore"
import type { ProductType } from "~/interface"

export const useDatas = () => {
  const nuxt = useNuxtApp()
  const db = nuxt.$db as Firestore
  const datas = ref<ProductType[]>([])
  const error = ref(null)

  const fetchData = async () => {
    try {
      const res = collection(db, "mens")
      const product = await getDocs(res)
      const productList = product.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
        }
      })
      datas.value = productList
    } catch (error: any) {
      error.value = error.message
      console.log(error)
    }
  }
  return { datas, error, fetchData }
}
