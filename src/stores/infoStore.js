import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useInfoStore = defineStore('infoStore', () => {
  const loginStatus = ref(false)
  const ansTime = ref([])
  if (sessionStorage.getItem('auth')) {
    loginStatus.value = true
  }
  return { loginStatus,ansTime }
})
