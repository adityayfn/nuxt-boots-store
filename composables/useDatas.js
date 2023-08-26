import { ref } from "vue"
import { getFirestore, collection, getDocs } from "firebase/firestore/lite"

export const useDatas = () => {
  const nuxt = useNuxtApp()
  const db = nuxt.$db
  const datas = ref([])
  const error = ref(null)
  const loading = ref(false)

  const fetchData = async () => {
    try {
      loading.value = true
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
    } finally {
      loading.value = false
    }
  }
  return { datas, error, loading, fetchData }
}
