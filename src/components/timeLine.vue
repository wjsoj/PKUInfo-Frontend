<script setup>
import { useStore } from '../stores'
import { storeToRefs } from 'pinia'
import dataPicker from './dataPicker.vue'
import timeLineItem from './timeLineItem.vue'
import { computed, ref } from 'vue'

const store = useStore()
const { activityList,loadingCombine } = storeToRefs(store)

let startDate = ref(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()))
let endDate = ref(new Date(new Date().getFullYear(), new Date().getMonth() , new Date().getDate() + 30, 23, 59, 59))

let maxLength = ref(3)
let loadingItem = ref(false)
let scrollDisable = ref(false)

// 筛选并按照时间排序
const result = computed(() => activityList.value.filter(activity => {
  let activityDate = new Date(activity.startDate)
  return activityDate.getTime() >= startDate.value.getTime() && activityDate.getTime() <= endDate.value.getTime()
}).sort((a,b) => {
  return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
}))

function updateDate (startdate,enddate) {
  maxLength.value = 3
  scrollDisable.value = false
  enddate.setHours(23,59,59)
  startDate.value = startdate
  endDate.value = enddate
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
  // 将group转换为数组
  let groupArray = []
  for (let date in group) {
    groupArray.push({
      date,
      activities: group[date]
    })
  }
  return groupArray
})

function load() {
  loadingItem.value = true
  // 假装自己在加载
  setTimeout(() => {
    maxLength.value += 3
    if (maxLength.value >= groupByDate.value.length) {
      scrollDisable.value = true
    }
    loadingItem.value = false
  }, 100)
}
</script>

<template>
  <div v-loading="loadingCombine">
    <dataPicker @change-date="updateDate"/>
  </div>
  <div class="ml-2 mr-4 mt-5">
    <el-timeline v-infinite-scroll="load" :infinite-scroll-disabled="scrollDisable">
      <!-- 遍历groupByDate -->
      <el-timeline-item
        v-for="({date, activities}) in groupByDate.slice(0, maxLength)"
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
  <h1 class="text-base text-center mb-2 text-sky-800 dark:text-sky-200" v-if="loadingItem">
    加载中...
  </h1>
  <h1 class="text-base text-center mb-3">共{{ result.length }}条</h1>

  <el-backtop :right="20" :bottom="70" />
</template>