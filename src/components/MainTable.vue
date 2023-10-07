<script setup>
import { useStore } from '../stores'
import { storeToRefs } from 'pinia'
import dataPicker from './dataPicker.vue'
import { computed, ref, onUpdated, onMounted } from 'vue'
import { useDark } from '@vueuse/core'
import searchBar from './searchBar.vue'
const isDark = useDark()
const store = useStore()
const { activityList,isLoading,loadingCombine } = storeToRefs(store)

let startDate = ref(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()))
let endDate = ref(new Date(new Date().getFullYear(), new Date().getMonth() , new Date().getDate() + 30, 23, 59, 59))
let keyWord = ref('')

let currentPage = ref(1)
let pageSize = ref(100)

const result = computed(() => activityList.value.filter(activity => {
  let activityDate = new Date(activity.startDate)
  return activityDate.getTime() >= startDate.value.getTime() && activityDate.getTime() <= endDate.value.getTime()
}).filter(activity => {
  // 如果关键词为空，返回所有活动
  if (keyWord.value === '') {
    return true
  }
  // 使用正则表达式快速匹配关键词
  let reg = new RegExp(keyWord.value, 'g')
  return reg.test(activity.title) || reg.test(activity.description)
}).sort((a,b) => {
  return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
})
)

function updateDate (startdate,enddate) {
  enddate.setHours(23,59,59)
  startDate.value = startdate
  endDate.value = enddate
}
function filterateEvent (keyword) {
  keyWord.value = keyword
}

// 识别关键词并高亮
function highLight(str) {
  if (keyWord.value === '') {
    return str
  }
  let reg = new RegExp(keyWord.value, 'g')
  return str.replace(reg, `<span class="bg-yellow-200 dark:bg-yellow-700">${keyWord.value}</span>`)
}

onMounted(() => {
  let footer = document.querySelector('footer')
  footer.classList.remove('fixed')
  if (document.body.clientHeight < window.innerHeight) {
    footer.classList.add('fixed')
  }
})

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
  <div class="flex flex-col md:flex-row justify-center"  v-loading="loadingCombine">
    <dataPicker @change-date="updateDate" />
    <searchBar @change-content="filterateEvent" />
  </div>
  
  <div class="md:mx-10 lg:mx-16">
    <el-table :data="result.slice((currentPage - 1) * pageSize, currentPage * pageSize)" :stripe="!isDark" v-loading="isLoading">
      <el-table-column type="expand" width="30">
        <template #default="{row}">
          <div class="ml-10 mr-2">
            <p>活动地点：{{ row.address }}</p>
            <p>举办单位：{{ row.college }}</p>
            <a :href="row.accountLink" class=" text-sky-800 dark:text-sky-200" target="_blank" rel="noopener noreferrer">原文链接</a>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="活动名称" min-width="180" >
        <template #default="{row}">
          <div v-html="highLight(row.title)"></div>
        </template>
      </el-table-column>
      <el-table-column sortable label="活动日期" min-width="100" >
        <template #default="{row}">
          <span v-if="row.startTime !== '00:00:00'">
            {{ row.startDate }} <span v-if="row.startDate!==row.endDate"> - {{ row.endDate }}</span> <br />
            {{ row.startTime }} - {{ row.endTime }}
          </span>
          <span v-else>{{ row.startDate }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="活动信息" min-width="360">
        <template #default="{row}">
          <div v-html="highLight(row.description)"></div>
        </template>
      </el-table-column>
    </el-table>

    <div class="justify-center hidden md:flex">
      <el-pagination layout="total, prev, pager, next, jumper" :total="result.length" :page-size="pageSize" @current-change="currentPage = $event" hide-on-single-page class="my-4 md:my-8" v-if="!isLoading">
      </el-pagination>
    </div>
    <div class="justify-center flex md:hidden">
      <el-pagination layout="total, prev, pager, next" :total="result.length" :page-size="pageSize" @current-change="currentPage = $event" hide-on-single-page small class="my-4 md:my-8" v-if="!isLoading">
      </el-pagination>
    </div>
  </div>

  <h1 class="text-base text-center my-2 md:my-4" v-if="!isLoading && result.length <= 100">共{{ result.length }}条</h1>
  <div class="md:hidden">
    <el-backtop :right="20" :bottom="120" />
  </div>
  <div class="hidden md:block">
    <el-backtop :right="60" :bottom="100" />
  </div>
</template>