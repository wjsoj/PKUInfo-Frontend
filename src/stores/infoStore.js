import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useInfoStore = defineStore('infoStore', () => {
  const loginStatus = ref(false)
  if (localStorage.getItem('loginUser')) {
    loginStatus.value = true
  }
  function login(user) {
    loginStatus.value = true
    localStorage.setItem('loginUser', JSON.stringify(user))
  }
  function logout() {
    loginStatus.value = false
    localStorage.removeItem('loginUser')
  }
  return { loginStatus,login,logout }
})
