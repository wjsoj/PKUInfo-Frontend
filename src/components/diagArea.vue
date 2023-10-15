<script setup>
import { onUpdated } from 'vue';

let { diag, isLoading } = defineProps(['diag', 'isLoading'])

onUpdated(() => {
  const diagArea = document.getElementById('diagarea')
  diagArea.scrollTop = diagArea.scrollHeight
})
</script>

<template>
  <div class="flex flex-col justify-start px-2 overflow-y-scroll w-full h-full" id="diagarea">
    <div v-for="item in diag" :key="item.id" >
      <div v-if="item.type === 'ask'" class="flex flex-row justify-end items-start ml-10 md:ml-40 my-2">
        <div class="rounded-xl text-sm md:text-base dark:bg-teal-700 bg-green-200 px-4 py-2">
          {{ item.content }}
        </div>
        <div class="ml-2 w-10 h-10 rounded-full bg-indigo-500 shrink-0">
        </div>
      </div>
      <div v-else class="flex flex-row justify-start items-start mr-10 md:mr-40 my-2">
        <div class="w-10 h-10 rounded-full mr-2 shrink-0">
          <img src="/favicon.png" alt="小北" class="w-full h-full">
        </div>
        <div class="rounded-xl text-sm md:text-base dark:bg-slate-700 bg-slate-200 px-4 py-2">
          {{ item.content }}
        </div>
      </div>
    </div>
    <div v-if="isLoading" class="flex flex-row justify-start items-start mr-10 md:mr-40 my-2">
      <div class="w-10 h-10 rounded-full mr-2 shrink-0">
        <img src="/favicon.png" alt="小北" class="w-full h-full">
      </div>
      <div class="rounded-xl text-sm md:text-base dark:bg-slate-700 bg-slate-200 px-4 py-2">
        加载中...请耐心等待响应
      </div>
      <div class="w-6 h-6 my-2" v-loading="isLoading"></div>
    </div>
      
  </div>
</template>