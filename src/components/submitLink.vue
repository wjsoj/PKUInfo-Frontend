<script setup>
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { request } from '@/utils/request'
import { UploadFilled } from '@element-plus/icons-vue'

let link = ref('')
let isPosting = ref(false)

async function submitLink() {
  if (link.value === '') {
    ElMessage({
      message: '链接不能为空',
      type: 'warning'
    })
    return
  }
  if (!link.value.startsWith('http')) {
    ElMessage({
      message: '链接格式错误',
      type: 'warning'
    })
    return
  }
  isPosting.value = true
  await request.post(
    "/user/submit/link",
    link.value,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  ).then(res => {
    isPosting.value = false
    if (res.data.code === 1) {
      ElMessage({
        message: '提交成功，请勿重复提交',
        type: 'success'
      })
      link.value = ''
    } else {
      ElMessage({
        message: res.data.msg,
        type: 'error'
      })
      console.log(res.data)
    }
  }).catch(err => {
    console.log(err)
    ElMessage({
      message: '提交失败',
      type: 'error'
    })
  })
}

</script>

<template>
  <div class="min-h-[80vh] flex flex-col justify-center items-center px-4 py-10 md:px-32 lg:px-80">
    <!-- 图片 -->
    <img src="/favicon.png" alt="submit" class="w-1/3 sm:w-1/4 md:w-1/5 lg:w-1/6 mb-5">
    <div class="h-10 md:h-12 lg:h-14 w-full my-4">
      <el-input
        v-model="link"
        placeholder="请输入要提交的链接"
        :prefix-icon="UploadFilled"
        class="mb-5 h-full w-full"
        size="large"
      />
    </div>
    <div class="flex w-full justify-center">
      <el-button type="primary" @click="submitLink" v-loading="isPosting" size="large" class="w-1/4 md:w-1/5 xl:w-1/6">提交</el-button>
    </div>
  </div>
</template>