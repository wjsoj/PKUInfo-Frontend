<script setup>
import { ref } from 'vue'
import tagItem from './tagItem.vue'
let emit = defineEmits(['changeTag'])
const all = ['学术','学工','就业','文艺','体育']
let selectedTag = ref(['学术','学工','就业','文艺','体育'])
const handleChange = (tag) => {
  isClose.value[all.indexOf(tag)] = !isClose.value[all.indexOf(tag)]
  if (selectedTag.value.includes(tag)) {
    selectedTag.value.splice(selectedTag.value.indexOf(tag), 1)
  } else {
    selectedTag.value.push(tag)
  }
  emit('changeTag', selectedTag.value)
}

// 数组形式
let isClose = ref([false,false,false,false,false])

function reset(flag) {
  if (flag === 1) {
    selectedTag.value = ['学术','学工','就业','文艺','体育']
    isClose.value = [false,false,false,false,false]
  } else {
    selectedTag.value = []
    isClose.value = [true,true,true,true,true]
  }
  emit('changeTag', selectedTag.value)
}
</script>

<template>
  <div class="flex flex-wrap justify-center mx-4 mb-4">
    <tagItem v-for="(tag,index) in all" :is-close="isClose[index]" :key="tag" :content="tag" closable @close="handleChange(tag)" />
    <span class="text-sky-800 dark:text-sky-200 cursor-pointer my-1.5 ml-2 text-sm lg:text-base" v-if="selectedTag.length < 5" @click="reset(1)">
      重置
    </span>
    <span class="text-sky-800 dark:text-sky-200 cursor-pointer my-1.5 ml-2 text-sm lg:text-base" v-else @click="reset(0)">
      全不选
    </span>
  </div>
</template>