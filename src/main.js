import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerSW } from 'virtual:pwa-register';
registerSW({ immediate: true })

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)


const options = {
  transition: "Vue-Toastification__slideBlurred",
  maxToasts: 8,
  newestOnTop: true,
  pauseOnHover: false,
  timeout: 2000,
  containerClassName: "my-container-class",
};
app.use(Toast, options);

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.deferredPrompt = e;
})

app.mount('#app')
