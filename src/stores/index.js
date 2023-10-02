import { ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '@/utils/request'

export const useStore = defineStore('store', () => {
  const activityList = ref([])
  const isLoading = ref(false)
  const result = ref([])

  async function fetchData(param) {
    await request.get('/user/activity/' + param).then(res => {
      activityList.value = activityList.value.concat(res.data.data)
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
    // 将activityList id 重复的去掉
    const hash = {}
    activityList.value = activityList.value.reduce((item, next) => {
      hash[next.id] ? '' : hash[next.id] = true && item.push(next)
      return item
    }, [])
    // 将activityList先按照startDate从小到大排序，相同情况下按照startTime排序
    activityList.value.sort((a, b) => {
      if (a.startDate !== b.startDate) {
        return a.startDate < b.startDate ? -1 : 1
      } else {
        return a.startTime < b.startTime ? -1 : 1
      }
    })
    console.log(activityList.value.length)
    // 将activityList中的startDate位于今天和接下来一个月的活动筛选出来
    result.value = activityList.value.filter(item => {
      const startDate = new Date(item.startDate)
      // 选取今天零点
      const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
      return (startDate >= today && startDate <= new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59))
    })
    isLoading.value = false
  }
  return { activityList,isLoading,initFetchData,result }
})
