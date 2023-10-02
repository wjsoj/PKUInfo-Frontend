<script setup>
import { useStore } from '../stores'
import { storeToRefs } from 'pinia'
import dataPicker from './dataPicker.vue'
import timeLineItem from './timeLineItem.vue'
import { computed } from 'vue'

const store = useStore()
const { activityList,result } = storeToRefs(store)

function updateDate (startDate,endDate) {
  endDate.setHours(23,59,59)
  result.value = activityList.value.filter(activity => {
    let activityDate = new Date(activity.startDate)
    return activityDate.getTime() >= startDate.getTime() && activityDate.getTime() <= endDate.getTime()
  })
}
const groupByDate = computed(() => {
  let group = {}
  result.value.forEach(activity => {
    let date = activity.startDate
    if (group[date]) {
      group[date].push(activity)
    } else {
      group[date] = [activity]
    }
  })
  return group
})
</script>

<template>
  <dataPicker @change-date="updateDate"/>
  <div class="ml-2 mr-4">
    <el-timeline>
      <!-- 遍历groupByDate -->
      <el-timeline-item
        v-for="(activities,date) in groupByDate"
        :key="date"
        :timestamp="date"
        placement="top">
        <el-card>
          <h3 class="text-lg my-2 text-slate-800 dark:text-slate-200">{{ date }}</h3>
          <el-timeline>
            <el-timeline-item
              v-for="activity in activities"
              :key="activity.id"
              :timestamp="activity.startTime"
              placement="top">
              <timeLineItem :activity="activity"/>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
  <h1 class="text-base text-center my-1">共{{ result.length }}条</h1>

  <el-backtop :right="20" :bottom="70" />
</template>