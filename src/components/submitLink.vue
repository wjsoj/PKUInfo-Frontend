<script setup>
import { ElMessage } from 'element-plus'
import { onMounted, onUnmounted, ref } from 'vue'
import { request } from '@/utils/request'
import { UploadFilled } from '@element-plus/icons-vue'

let link = ref('')

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
  await request({
    url: '/user/submit/link',
    method: 'post',
    data: {
      link: link.value
    }
  })
}

</script>

<template>
  <div class="min-h-[80vh] flex flex-col justify-center items-center px-4 py-10 md:px-32 lg:px-80">
    <el-input
      v-model="link"
      placeholder="请输入要提交的链接"
      :prefix-icon="UploadFilled"
      class="mb-5"
      size="large"
    />
    <el-button type="primary" @click="submitLink" size="large">提交</el-button>
  </div>
</template>