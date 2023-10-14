<script setup>
import { ref } from 'vue'

let emit = defineEmits(['changeDate'])

let startDate = ref(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()))
// endDate为30天后的晚上23:59:59
let endDate = ref(new Date(new Date().getFullYear(), new Date().getMonth() , new Date().getDate() + 30, 23, 59, 59))

const disabledStartDate = (time) => {
  // time小于10天前的日期
  return (time.getTime() < new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 10).getTime()
  // 结束日期存在且time大于等于结束日期
  || (endDate.value && time.getTime() >= endDate.value.getTime())
  // time大于90天后的日期
  || time.getTime() > new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 89).getTime())
}
const disabledEndDate = (time) => {
  // time大于90天后的日期
  return (time.getTime() > new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 90).getTime()
  // 开始日期存在且time小于等于开始日期
  || (startDate.value && time.getTime() <= startDate.value.getTime())
  // time小于10天前的日期
  || time.getTime() < new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 9).getTime())
}

const handleChange = () => {
  emit('changeDate', startDate.value, endDate.value)
  // 让日期选择器失去焦点
  document.activeElement.blur()
}
</script>

<template>
  <div class="flex flex-col md:flex-row md:justify-center items-center my-2 md:my-0">
    <div class="flex flex-row my-2 mx-4 items-center">
      <p class="mr-3 md:text-lg shrink-0">开始日期：</p>
      <el-date-picker
        v-model="startDate"
        type="date"
        placeholder="选择开始日期"
        :disabled-date="disabledStartDate"
        @change="handleChange"
      />
    </div>
    <div class="flex flex-row my-2 mx-4 items-center">
      <p class="mr-3 md:text-lg shrink-0">结束日期：</p>
      <el-date-picker
        v-model="endDate"
        type="date"
        placeholder="选择结束日期"
        :disabled-date="disabledEndDate"
        @change="handleChange"
      />
    </div>
  </div>
</template>