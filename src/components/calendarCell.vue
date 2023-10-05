<script setup>
import { ref } from 'vue'

let drawer = ref(false)
let { activities, day } = defineProps({
  activities: {
    required: false
  },
  day: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div @click="drawer = true" class="flex flex-col w-full">
    <h1 class="font-semibold text-xl mb-2">
      {{ day.split('-')[2]}}
    </h1>
    <div v-if="activities[0]==='不在支持的日期范围内'">
      <br/>
    </div>
    <div v-else>
      <div v-if="activities.length">

        {{ activities[0].title }} 
        <br />
        等{{ activities.length }}个活动

        <el-drawer
          v-model="drawer"
          :title="day+'活动列表'"
          size="70%"
        >
          <el-collapse accordion>
            <el-timeline>
              <el-timeline-item
                v-for="activity in activities"
                :key="activity.id"
                :timestamp="activity.startDate+' '+activity.startTime+'-'+activity.endTime"
              >
                <el-collapse-item :title="activity.title" :name="activity.id">
                  <!-- 将activity所有字段以key - value的表格形式显示在一起 -->
                  <div v-for="(value, key) in activity" :key="key" class="grid grid-cols-3">
                    <p class="font-semibold">{{ key }}：</p>
                    <p class=" col-span-2">{{ value }}</p>
                  </div>
                </el-collapse-item>
              </el-timeline-item>
            </el-timeline>
          </el-collapse>
        </el-drawer>

      </div>
      <div v-else>
        暂无活动
      </div>
    </div>
  </div>
</template>