<script setup>
import { useDark,useToggle } from '@vueuse/core'
import { Sunny, Moon } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
const isDark = useDark()
const router = useRouter()
const activeName = ref('')
// 获取当前网页路由
onMounted(() => {
  activeName.value = router.currentRoute.value.path == '/' ? 'first' : router.currentRoute.value.path == '/calendar' ? 'second' : 'third'
})

const toggleDark = useToggle(isDark)

const handleChange = (name) => {
  if (name === 'first') {
    router.push('/')
  } else if (name === 'second') {
    router.push('/calendar')
  } else if (name === 'third') {
    router.push('/submit')
  }
}

function goToUrl (url) {
  window.open(url)
}
</script>

<template>
<div class="flex flex-col">
  <div class="flex flex-row justify-between items-center py-3 px-4 lg:px-10 lg:py-1 bg-slate-200 dark:bg-slate-800">
    <h1 class="text-[26px] lg:text-3xl font-semibold bg-clip-text bg-gradient-to-t text-transparent from-slate-700 to-sky-800 dark:from-slate-50 dark:to-sky-300">PKU Info</h1>
    <div class="flex flex-row items-center">
      <div class="flex-row mr-10 mt-2 hidden md:flex">
        <el-tabs v-model="activeName" @tab-change="handleChange">
        <el-tab-pane label="活动列表" name="first" />
        <el-tab-pane label="活动日历" name="second" />
        <!-- <el-tab-pane label="提交链接" name="third" /> -->
      </el-tabs>
      </div>
      <div @click="toggleDark()" class="mr-2 text-3xl">
        <Sunny v-if="isDark" style="width: 1em; height: 1em;"/>
        <Moon v-else style="width: 1em; height: 1em;"/>
      </div>
      <div class="text-3xl" @click="goToUrl('https://github.com/EMOAIRX/PKUinfo')">
        <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" width="1em" height="1em" data-v-6c8d2bba=""><path fill="currentColor" d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476c0-.237-.013-1.024-.013-1.862c-2.512.463-3.162-.612-3.362-1.175c-.113-.288-.6-1.175-1.025-1.413c-.35-.187-.85-.65-.013-.662c.788-.013 1.35.725 1.538 1.025c.9 1.512 2.338 1.087 2.912.825c.088-.65.35-1.087.638-1.337c-2.225-.25-4.55-1.113-4.55-4.938c0-1.088.387-1.987 1.025-2.688c-.1-.25-.45-1.275.1-2.65c0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337c1.912-1.3 2.75-1.024 2.75-1.024c.55 1.375.2 2.4.1 2.65c.637.7 1.025 1.587 1.025 2.687c0 3.838-2.337 4.688-4.562 4.938c.362.312.675.912.675 1.85c0 1.337-.013 2.412-.013 2.75c0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z"></path></svg>
      </div>
    </div>
  </div>

  <div class="mx-2 md:hidden">
    <el-tabs v-model="activeName" :stretch="true" @tab-change="handleChange">
      <el-tab-pane label="活动列表" name="first" />
      <el-tab-pane label="活动日历" name="second" />
      <!-- <el-tab-pane label="提交链接" name="third" /> -->
    </el-tabs>
  </div>
</div>
  
</template>