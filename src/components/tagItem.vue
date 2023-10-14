<script setup>
let {content, closable, isClose} = defineProps({
  content: String,
  closable: {
    type: Boolean,
    default: false
  },
  isClose: Boolean
})
let emit = defineEmits(['close'])
// ['学术','学工','就业','文艺','体育']
</script>

<template>
  <div class="flex shrink-0">
    <div v-if="closable" class="cursor-pointer" :class="{'opacity-30 dark:opacity-50': isClose}" @click="emit('close')">
      <div :class="content === '学术' ? 'bg-sky-200 dark:bg-sky-800' : content === '学工' ? 'bg-rose-200 dark:bg-rose-800' : content === '就业' ? 'bg-orange-200 dark:bg-orange-800' : content === '文艺' ? 'bg-violet-200 dark:bg-violet-800' : content === '体育' ? 'bg-green-200 dark:bg-green-800' : 'bg-gray-200 dark:bg-gray-800' " class="px-3 py-0.5 mx-1 lg:mx-2 lg:text-base lg:px-4 my-1 rounded-xl text-sm font-medium">
        <span class="text-dark dark:text-white">{{ content }}</span>
      </div>
    </div>
    <div v-else>
      <div :class="content === '学术' ? 'bg-sky-200 dark:bg-sky-800' : content === '学工' ? 'bg-rose-200 dark:bg-rose-800' : content === '就业' ? 'bg-orange-200 dark:bg-orange-800' : content === '文艺' ? 'bg-violet-200 dark:bg-violet-800' : content === '体育' ? 'bg-green-200 dark:bg-green-800' : 'bg-gray-200 dark:bg-gray-800' " class="px-3 py-0.5 mx-1 my-1 rounded-xl text-sm font-medium">
        <span class="text-dark dark:text-white">{{ content }}</span>
      </div>
    </div>
  </div>
</template>