<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import diagArea from '../components/diagArea.vue'
import { request } from '@/utils/request'
import { ElMessage } from 'element-plus'
let ask = ref('')
let isFetching = ref(false)
let diagHistory = ref([])

const today = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
const date1 = new Date()
date1.setDate(date1.getDate() + 30)
const nextMonth = date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate()

const initContent = '这里是不是应该写点啥[那啥，大家要求不要太高，可以理解成这就是个套壳GPT的搜索，提问方式类似于【有什么计算机相关的讲座（信科，信息科学技术学院）】以及不要报以太高的期望]'

async function addHistory () {
  if (ask.value) {
    diagHistory.value.push({
      id: diagHistory.value.length,
      type: 'ask',
      content: ask.value
    })
    isFetching.value = true

    await request.get('/user/activity/talking/' + ask.value + '/' + today + '/' + nextMonth).then(res => {
      diagHistory.value.push({
        id: diagHistory.value.length,
        type: 'answer',
        content: JSON.parse(res.data.msg).response.slice(1, -1).replace(/\\n/g, '\n')
      })
      isFetching.value = false
    }).catch(err => {
      ElMessage.error(err.code)
      isFetching.value = false
    })
    ask.value = ''
    // document.getElementsByClassName('el-textarea__inner')[0].focus()
  } else {
    ElMessage.warning('请输入问题')
  }
}

function reset () {
  diagHistory.value = [{
    id: 0,
    type: 'answer',
    content: initContent
  }]
  localStorage.removeItem('diagHistory')
}

onMounted(() => {
  if (localStorage.getItem('diagHistory')) {
    diagHistory.value = JSON.parse(localStorage.getItem('diagHistory'))
  } else {
    diagHistory.value = [{
      id: 0,
      type: 'answer',
      content: initContent
    }]
  }
  // 控制mainarea的高度为固定值
  // 如果屏幕宽度大于768px
  let mainarea = document.getElementById('mainarea')
  if (window.innerWidth > 768) {
    mainarea.style.height = window.innerHeight - 180 + 'px'
  } else {
    mainarea.style.height = window.innerHeight - 213 + 'px'
  }
})
onUnmounted(() => {
  localStorage.setItem('diagHistory', JSON.stringify(diagHistory.value))
})
</script>

<template>
  <div class="w-full">
    <div class="w-full md:px-20 xl:px-48 mt-[-14px] md:mt-0" id="mainarea">
      <diagArea :diag="diagHistory" :is-loading="isFetching"/>
    </div>
    <div class="fixed bottom-0 w-full py-3 bg-slate-200 dark:bg-slate-800">
      <div class="flex flex-row items-center px-4 md:px-24 xl:px-56">
        <div class="w-full mr-4">
          <el-input v-model="ask" placeholder="请输入问题" :autosize="{ minRows: 2}" type="textarea" clearable maxlength="200" :disabled="isFetching" @keydown.enter.exact.prevent="addHistory" />
        </div>
        <div class="text-2xl px-2 py-2 rounded-full bg-teal-200 dark:bg-blue-600 cursor-pointer" @click="addHistory">
          <Promotion style="width: 1em; height: 1em;"/>
        </div>
      </div>
      <div class="flex justify-center">
        <span class="text-sky-800 dark:text-sky-200 cursor-pointer mt-2" @click="reset()">重置会话</span>
      </div>
    </div>
  </div>
</template>