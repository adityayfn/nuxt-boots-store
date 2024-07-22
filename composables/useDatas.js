import { ref } from "vue"
import { collection, getDocs } from "firebase/firestore"

export const useDatas = () => {
  const nuxt = useNuxtApp()
  const db = nuxt.$db
  const datas = ref([])
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
    } catch (error) {
      error.value = error.message
      console.log(error)
    }
  }
  return { datas, error, fetchData }
}
