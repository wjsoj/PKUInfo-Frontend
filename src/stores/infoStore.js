import { ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '@/utils/request'

export const useInfoStore = defineStore('infoStore', () => {
  const loginStatus = ref(false)
  const ansTime = ref([])
  const activityList = ref([])
  async function login(username, password) {
    await request.post('/login', { 
      username: username,
      password: password
    }).then((res) => {
      if (res.data.code === 200) {
        sessionStorage.setItem('auth', res.data.data.token)
      } else  {
        console.log(res)
      }
    }).catch((err) => {
      console.log(err)
    })
  }
  if (sessionStorage.getItem('auth')) {
    loginStatus.value = true
  }
  if (localStorage.getItem('username')) {
    login(localStorage.getItem('username'), localStorage.getItem('password'))
  }
  return { loginStatus,ansTime,activityList }
})
