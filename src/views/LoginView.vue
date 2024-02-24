<script setup>
import { reactive } from 'vue';
import { useInfoStore } from '@/stores/infoStore';
const { login } = useInfoStore();
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
const toast = useToast();
const router = useRouter();

const user = reactive({
  account: '',
  password: ''
})

function signin() {
  login(user)
  toast.success('登录成功',{
    timeout: 2000
  })
  router.push('/profile')
}

function isLogined() {
  let userLogin = localStorage.getItem('loginUser') // 获取存储对象
  console.log(userLogin)
}
</script>

<template>
  <div class="grow flex flex-col space-y-4 justify-center items-center h-full">
    <h1 class="text-2xl font-bold">登录</h1>
    <label class="input input-bordered flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
      <input type="text" class="grow" placeholder="Username" v-model="user.account" />
    </label>
    <label class="input input-bordered flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path fill-rule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clip-rule="evenodd" /></svg>
      <input type="password" class="grow" v-model="user.password" />
    </label>
    <button class="btn btn-primary" @click="signin">登录</button>
    <button class="btn btn-accent ml-4" @click="isLogined">查看是否已经登录</button>
  </div>
</template>