<script setup>
import { useStore } from '../stores'
import { storeToRefs } from 'pinia'
import dataPicker from './dataPicker.vue'
import { computed, ref } from 'vue'
const store = useStore()
const { activityList,isLoading } = storeToRefs(store)

let startDate = ref(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()))
let endDate = ref(new Date(new Date().getFullYear(), new Date().getMonth() , new Date().getDate() + 30, 23, 59, 59))

const result = computed(() => activityList.value.filter(activity => {
  let activityDate = new Date(activity.startDate)
  return activityDate.getTime() >= startDate.value.getTime() && activityDate.getTime() <= endDate.value.getTime()
}))

function updateDate (startdate,enddate) {
  enddate.setHours(23,59,59)
  startDate.value = startdate
  endDate.value = enddate
}
</script>

<template>
  <dataPicker @change-date="updateDate" />

  <div class="min-h-[80vh] md:mx-10 lg:mx-16">
    <el-table :data="result" stripe v-loading="isLoading">
      <el-table-column type="expand" width="30">
        <template #default="{row}">
          <div class="ml-10 mr-2">
            <p>活动地点：{{ row.address }}</p>
            <p>举办学院：{{ row.college }}</p>
            <a :href="row.accountLink" class=" text-sky-800 dark:text-sky-200" target="_blank" rel="noopener noreferrer">原文链接</a>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="活动名称" min-width="180" />
      <el-table-column sortable label="活动日期" min-width="150" >
        <template #default="{row}">
          <span>{{ row.startDate }}  {{ row.startTime }} - {{ row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="活动信息" min-width="360"/>
    </el-table>
  </div>

  <h1 class="text-base text-center my-2 md:my-4">共{{ result.length }}条</h1>
  <div class="md:hidden">
    <el-backtop :right="20" :bottom="70" />
  </div>
  <div class="hidden md:block">
    <el-backtop :right="60" :bottom="100" />
  </div>
</template>