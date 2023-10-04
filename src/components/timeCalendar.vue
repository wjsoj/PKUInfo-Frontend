<script setup>
import { useStore } from '../stores'
import { storeToRefs } from 'pinia'
import calendarCell from './calendarCell.vue'
import { onUpdated } from 'vue';

const store = useStore()
const { loadingCombine,activityList } = storeToRefs(store)

function isInRange(dayString) {
  const day = new Date(dayString)
  return (day.getTime() >= new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 30, 0, 0 ,0).getTime() && day.getTime() <= new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 90, 23, 59, 59).getTime())
}

function getActivitiesByDate (date) {
  if (isInRange(date)){
    return activityList.value.filter(activity => {
      return activity.startDate === date
    })
  } else {
    return ['不在支持的日期范围内']
  }
}

// 监听窗口内容变化，如果窗口内容高度不足窗口高度，将footer固定在底部
onUpdated(() => {
  let footer = document.querySelector('footer')
  footer.classList.remove('fixed')
  if (document.body.clientHeight < window.innerHeight) {
    footer.classList.add('fixed')
  }
})
</script>

<template>
  <div class="min-h-[80vh] mx-10 my-6">
    <el-calendar v-loading="loadingCombine">
      <template #date-cell="{ data }">
          <calendar-cell :activities="getActivitiesByDate(data.day)" :day="data.day"/>
      </template>
    </el-calendar>
  </div>
</template>

<style>
.el-calendar-day {
  height: auto !important;
}
</style>