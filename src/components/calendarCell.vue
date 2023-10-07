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
          size="60%"
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
                  <div class="grid grid-cols-3">

                    <p class="font-semibold">活动地点：</p>
                    <p class=" col-span-2">{{ activity.address }}</p>

                    <p class="font-semibold">活动日期：</p>
                    <p class=" col-span-2" v-if="activity.startTime !== '00:00:00'">{{ activity.startDate }} <span v-if="activity.startDate!==activity.endDate"> - {{ activity.endDate }}</span> {{ activity.startTime }} - {{ activity.endTime }}</p>
                    <p class=" col-span-2" v-else>{{ activity.startDate }}</p>

                    <p class="font-semibold">举办单位：</p>
                    <p class=" col-span-2">{{ activity.college }}</p>

                    <p class="font-semibold">活动详情：</p>
                    <p class=" col-span-2">{{ activity.description }}</p>

                    <p class="font-semibold">原文链接：</p>
                    <p class=" col-span-2">
                      <a :href="activity.accountLink" class=" text-sky-800 dark:text-sky-200 hover:text-sky-600 dark:hover:text-sky-400 hover:underline" target="_blank" rel="noopener noreferrer">{{ activity.accountLink }}</a>
                    </p>

                    <p class="font-semibold">补充信息：</p>
                    <p class=" col-span-2">{{ activity.extraInfo }}</p>
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