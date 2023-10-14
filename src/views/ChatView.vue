<script setup>
import chatArea from '../components/chatArea.vue'
import { onMounted, onUnmounted } from 'vue'

// 隐藏页脚
onMounted(() => {
  let footer = document.querySelector('footer')
  footer.style.display = 'none'
})
onUnmounted(() => {
  let footer = document.querySelector('footer')
  footer.style.display = 'block'
})

</script>

<template>
  <div>
  <div class="md:hidden">
    <chatArea />
  </div>
  <div class="hidden md:block">
    <h1>电脑端懒得适配了,目前页脚显示有Bug</h1>
  </div>
  </div>
</template>