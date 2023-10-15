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
    <chatArea />
  </div>
</template>