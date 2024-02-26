import axios from 'axios'
import { useToast } from 'vue-toastification';

const toast = useToast()

// 封装 baseURL
const request = axios.create({
    // baseURL: "https://pkuinfo.lcpu.dev/api"
    // baseURL: "http://111.229.135.84:8080",
    baseURL: "/api",
    timeout: 10000,
})
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers.post['Content-Type'] = 'application/json'

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    if (sessionStorage.getItem('token')) {
    config.headers.Authorization = `Bearer ${sessionStorage.getItem('token')}`
    }
    return config
  },
  (err) => Promise.reject(err)
)

// 响应拦截器
axios.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.data) {
      const code = err.response.status
      const msg = err.response.data.message
      toast.error(`Code: ${code}, Message: ${msg}`)
    } else {
      toast.error(`${err}`)
    }
    return Promise.reject(err)
  }
)

// 向外暴露 request
export { request }