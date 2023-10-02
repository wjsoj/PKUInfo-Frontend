import { ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '@/utils/request'

export const useStore = defineStore('store', () => {
  const activityList = ref([])
  const isLoading = ref(false)

  function concatArray(arr1, arr2) {
    // 排序
    arr2.sort((a, b) => {
      if (a.startDate !== b.startDate) {
        return a.startDate < b.startDate ? -1 : 1
      } else {
        return a.startTime < b.startTime ? -1 : 1
      }
    })
    // 检查arr2中的元素是否在arr1中存在（根据id），如果不存在则将其添加到arr1中
    arr2.forEach(item => {
      if (!arr1.some(item1 => item1.id === item.id)) {
        arr1.push(item)
      }
    })
  }

  async function fetchData(param) {
    await request.get('/user/activity/' + param).then(res => {
      concatArray(activityList.value, res.data.data)
      console.log('fetchData '+param)
    }).catch(err => {
      console.log(err)
    })
  }
  async function initFetchData() {
    isLoading.value = true
    // 获取今天的日期
    const today = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
    // 获取活动列表
    await request.get('/user/activity/' + today).then(res => {
      activityList.value = res.data.data
    }).catch(err => {
      console.log(err)
    })
    activityList.value.sort((a, b) => {
      if (a.startDate !== b.startDate) {
        return a.startDate < b.startDate ? -1 : 1
      } else {
        return a.startTime < b.startTime ? -1 : 1
      }
    })
    // 构造30天前的日期
    const date = new Date()
    date.setDate(date.getDate() - 30)
    const lastMonth = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    fetchData(lastMonth)
    // 构造30天后的日期
    const date1 = new Date()
    date1.setDate(date1.getDate() + 30)
    const nextMonth = date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate()
    fetchData(nextMonth)
    // 构造60天后的日期
    const date2 = new Date()
    date2.setDate(date2.getDate() + 60)
    const nextMonth1 = date2.getFullYear() + '-' + (date2.getMonth() + 1) + '-' + date2.getDate()
    fetchData(nextMonth1)
    isLoading.value = false
  }
  return { activityList,isLoading,initFetchData }
})
