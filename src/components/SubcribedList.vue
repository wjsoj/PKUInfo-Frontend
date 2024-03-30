<script setup>
import { request } from '@/utils/request';
import ActivityDetail from './ActivityDetail.vue';
import SubcribedCalendar from './SubcribedCalendar.vue';
import { onMounted, ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
const toast = useToast();

const SubcribedList = ref([]);
const loading = ref(false);
const isCalendarView = ref(true);
if (localStorage.getItem('isCalendarView') === 'false') {
  isCalendarView.value = false;
}

const getSubscribed = async () => {
  loading.value = true;
  const res = await request.get('/auth/activity/subscribed').then(res => res.data.data).catch(err => {
    console.log('err', err);
  });
  SubcribedList.value = res;
  loading.value = false;
}

// DELETE /auth/subscribe/{activityId}
const unsubscribe = async (activityId) => {
  await request.delete(`/auth/subscribe/${activityId}`).then(() => {
    getSubscribed();
    toast.success('取消订阅成功');
  }).catch(err => {
    console.log('err', err);
  });
}

onMounted(() => {
  getSubscribed();
})
watch(isCalendarView, (val) => {
  localStorage.setItem('isCalendarView', val);
})
</script>

<template>
<div class="mx-auto flex space-x-3 items-center my-4">
  <p class="cursor-pointer text-sm lg:text-base" :class="{'font-semibold' : isCalendarView==false}" @click="isCalendarView = false">列表视图</p>
  <input type="checkbox" class="toggle toggle-md" v-model="isCalendarView" />
  <p class="cursor-pointer text-sm lg:text-base" :class="{'font-semibold' : isCalendarView==true}" @click="isCalendarView = true">日历视图</p>
</div>

<div class="flex flex-col items-center">
  <!-- 列表 -->
  <div v-if="!isCalendarView" class="max-w-screen-sm px-4 my-10">
    <div v-for="activity in SubcribedList" :key="activity.id" class="flex flex-col items-center">
      <p class=" self-start text-xs lg:text-sm">{{ activity.startDate }}</p>
      <div class="flex flex-row justify-between w-full">
        <div class="grow self-start text-lg font-bold">{{ activity.title }}</div>
        <button class="btn btn-xs lg:btn-sm btn-primary self-end ml-2" @click="unsubscribe(activity.id)">取消订阅</button>
      </div>
      <div tabindex="0" class="collapse"> 
        <div class="collapse-title text-sm font-medium">
          详情
        </div>
        <div class="collapse-content"> 
          <ActivityDetail :activity="activity" />
        </div>
      </div>
    </div>
    <div v-if="SubcribedList.length === 0 && !loading" class="flex justify-center items-center h-64">
      <p class="text-xl font-bold">暂无订阅活动</p>
    </div>
  </div>
  <div v-else>
    <SubcribedCalendar :SubcribedList="SubcribedList" @update-subcribed="getSubscribed" />
  </div>
</div>
</template>