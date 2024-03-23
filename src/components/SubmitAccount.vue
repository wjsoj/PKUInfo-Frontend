<script setup>
import { ref } from 'vue';
import { getAccount } from '@/utils/account';
import { useToast } from 'vue-toastification';
import { request } from '@/utils/request';
const toast = useToast();
const name = ref('');
const accountList = ref([]);
const loading = ref(false);

async function search() {
  if (!name.value) {
    toast.error('请输入公众号名称');
    return;
  }
  accountList.value = [];
  loading.value = true;
  const res = await getAccount(name.value)
    .then(res => {
      loading.value = false;
      return res.data.data.data;
    })
    .catch(err => {
      toast.error('接口调用失败');
      console.error(err);
    });
  accountList.value = res;
}

// POST /auth/officalaccount/{account}
async function submit() {
  if (!name.value) {
    toast.error('请输入公众号名称');
    return;
  }
  await request.post(`/auth/officalaccount/${name.value}`)
    .then(res => {
      if (res.data.code === 200) {
        toast.success('提交成功');
        name.value = '';
      } else {
        if (res.data.code == 400) {
          toast.error('公众号已存在');
        } else {
          toast.error('提交失败，服务端故障');
        }
      }
    })
    .catch(err => {
      toast.error('提交失败');
      console.error(err);
    });
}
</script>

<template>
  <div class="flex flex-col items-center my-10 space-y-4">
    <label class="input input-bordered flex items-center gap-2">
      公众号名称
      <input type="text" v-model="name" class="grow border-l-2 border-primary pl-1" placeholder="北京大学" />
    </label>
    <div class="flex flex-row space-x-4">
      <!-- <button class="btn px-10 btn-secondary" @click="search">搜索</button> -->
      <button class="btn px-10 btn-primary" @click="submit">提交</button>
    </div>
    <!-- <div class="flex flex-col items-center space-y-8 py-10">
      <div class="flex flex-row space-x-4 lg:grid grid-cols-6 items-center w-screen px-6 lg:px-0 lg:w-[60vw]" v-for="(item,index) in accountList" :key="index">
        <img :src="item.media_picurl" class="rounded-full w-16 lg:col-span-1" />
        <div class="flex flex-col lg:grid lg:col-span-5 lg:grid-cols-5">
          <div class="flex flex-col justify-center lg:col-span-2">
            <div class="text-lg font-semibold">{{ item.media_name }}</div>
            <div class="text-sm">{{ item.media_id }}</div>
          </div>
          <p class="text-sm line-clamp-5 lg:col-span-3">{{ item.media_discription }}</p>
        </div>
      </div>
    </div> -->
    <span v-if="loading" class="loading loading-dots loading-lg"></span>
  </div>
</template>