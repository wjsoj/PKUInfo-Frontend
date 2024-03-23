<script setup>
import { ref } from 'vue';
import { request } from '@/utils/request';
import { useToast } from 'vue-toastification';
const toast = useToast();
const url = ref('');
async function submit() {
  if (!url.value) {
    toast.error('请输入文章链接');
    return;
  }
  // regex test https://mp.weixin.qq.com/s/...
  const reg = /^https:\/\/mp.weixin.qq.com\/s\/[a-zA-Z0-9_-]+$/;
  if (!reg.test(url.value)) {
    toast.error('请输入正确的文章链接');
    return;
  }
  // POST /auth/link { link: url }
  await request.post('/auth/link', { link: url.value })
    .then(res => {
      if (res.data.code === 200) {
        toast.success('提交成功');
        url.value = '';
      } else {
        if (res.data.code == 400) {
          toast.error('文章已存在');
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
    <textarea type="text" v-model="url" class="antialiased break-all textarea lg:textarea-lg textarea-bordered min-w-64 lg:min-w-96 text-wrap bg-transparent leading-5 grow bg-base-100" placeholder="文章链接" />
    <div class="flex flex-row space-x-4">
      <button class="btn px-10 btn-primary" @click="submit">提交</button>
    </div>
  </div>
</template>