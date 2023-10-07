<script setup>
import { ref } from 'vue'
let emit = defineEmits(['changeContent'])
let input = ref('')
let inputArea = ref(null)
function handleChange() {
  emit('changeContent', input.value)
  inputArea.value.blur()
}
</script>

<template>
  <div class="flex flex-row justify-center items-center mt-2 mb-6 md:my-4 lg:my-8 mx-6">
    <el-input v-model="input" placeholder="搜索内容" clearable @change="handleChange" ref="inputArea"/>
    <el-button type="primary" class="ml-4" @click="handleChange">搜索</el-button>
  </div>
</template>