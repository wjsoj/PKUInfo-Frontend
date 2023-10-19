<script setup>
import { useStore } from '../stores'
import { storeToRefs } from 'pinia'
import calendarCell from './calendarCell.vue'
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';

const store = useStore()
const { loadingCombine,activityList } = storeToRefs(store)
const date = ref(new Date())

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

watch(date, (newDate, oldDate) => {
  // newDate在今天之后，且在今天之后90天之内
  if (newDate.getTime() > new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0 ,0).getTime() && newDate.getTime() < new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 90, 23, 59, 59).getTime()) {
    return
  }
  // newDate在今天之前，且newDate的月底在今天之前30天之内
  else if (newDate.getTime() < new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0 ,0).getTime() && new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0, 23, 59, 59).getTime() > new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 30, 0, 0 ,0).getTime()) {
    return
  }
  ElMessage.warning('不在支持的日期范围内')
  // 还原为旧日期
  date.value = oldDate
})
</script>

<template>
  <div class="mx-10 my-6">
    <el-calendar v-loading="loadingCombine" v-model="date">
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