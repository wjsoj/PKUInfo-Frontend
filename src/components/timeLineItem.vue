<script setup>
import { ref } from 'vue'
let dialogVisible = ref(false)
let { activity } = defineProps({
  activity: {
    type: Object,
    required: true
  }
})

function openDialog () {
  dialogVisible.value = true
}
function goToUrl (url) {
  window.open(url)
}
</script>

<template>
  <el-card>
    <h4 class="text-lg font-semibold my-2 text-slate-700 dark:text-slate-300">{{ activity.title }}</h4>
    <p class="text-sky-800 dark:text-sky-200" @click="openDialog">查看详情</p>
    <el-dialog v-model="dialogVisible" title="活动详情" width="80%" align-center>
      <div class="flex flex-col justify-center items-start">
        <h2 class="font-semibold text-lg my-2">{{ activity.title }}</h2>
        <p v-if="activity.address" class="my-1 flex">
          <span class="shrink-0">活动地点：</span>
          <span>{{ activity.address }}</span>
        </p>
        <p v-if="activity.college" class="my-1 flex">
          <span class="shrink-0">举办院系：</span>
          <span >{{ activity.college }}</span>
        </p>
        <p class="my-1">
          {{ activity.description }}</p>
        <el-button type="primary" plain @click="goToUrl(activity.accountLink)" class=" self-center mt-5">查看推送</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>