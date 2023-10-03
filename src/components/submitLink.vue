<script setup>
import { ElMessage } from 'element-plus'
import { onMounted, onUnmounted, ref } from 'vue'
import { request } from '@/utils/request'
import { UploadFilled } from '@element-plus/icons-vue'

let link = ref('')
let isPosting = ref(false)

onMounted(() => {
  document.querySelector('footer').style.position = 'fixed'
})
onUnmounted(() => {
  document.querySelector('footer').style.position = 'relative'
})

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
        message: '提交成功',
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
    <el-input
      v-model="link"
      placeholder="请输入要提交的链接"
      :prefix-icon="UploadFilled"
      class="mb-5"
      size="large"
    />
    <el-button type="primary" @click="submitLink" v-loading="isPosting" size="large">提交</el-button>
  </div>
</template>