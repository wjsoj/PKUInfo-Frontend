<script setup>
import { ref } from 'vue';
import { ChevronRight, ChevronLeft } from 'lucide-vue-next';
import moment from 'moment';
import { request } from '@/utils/request';
import { useToast } from 'vue-toastification';
import ActivityCard from './ActivityCard.vue';

const { SubcribedList } = defineProps(['SubcribedList']);
const emit = defineEmits(['updateSubcribed']);

const toast = useToast();

const today = moment().startOf('day');
const weekdays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];

const firstDayOfMonth = ref(moment().startOf('month'));
const currentMonth = ref(moment(today).format("MMMM-yyyy"));
const selectedDate = ref(today);

const allDaysInMonth = ()=> {
  let start = moment(firstDayOfMonth.value).startOf('week')
  let end = moment(moment(firstDayOfMonth.value).endOf('month')).endOf('week')
  var days = [];
  var day = start;
  while (day <= end) {
    days.push(day.toDate());
    day = day.clone().add(1, 'd');
  }
  return days
}

const unsubscribe = async (activityId) => {
  await request.delete(`/auth/subscribe/${activityId}`).then(() => {
    emit('updateSubcribed');
    toast.success('取消订阅成功');
  }).catch(err => {
    console.log('err', err);
  });
}

const isToday = (date) => {
  return moment(date).isSame(moment(), 'day');
}

const isDifferentMonth = (date) => {
  return moment(date).month() != moment(firstDayOfMonth.value).month() 
}

const getPrevMonth = () => {
  const firstDayOfPrevMonth = moment(firstDayOfMonth.value).add(-1, 'M').startOf('month');
  firstDayOfMonth.value = firstDayOfPrevMonth;
  currentMonth.value = moment(firstDayOfPrevMonth).format("MMM-yyyy");
};

const getCurrentMonth = () => {
  const firstDayOfCurrMonth = moment().startOf('month');
  firstDayOfMonth.value = firstDayOfCurrMonth;
  currentMonth.value = moment(firstDayOfCurrMonth).format("MMM-yyyy");
};

const getNextMonth = () => {
  const firstDayOfNextMonth = moment(firstDayOfMonth.value).add(1, 'M').startOf('month');
  firstDayOfMonth.value = firstDayOfNextMonth;
  currentMonth.value = moment(firstDayOfNextMonth).format("MMM-yyyy");
};
</script>

<template>
<div class="w-full lg:w-screen lg:px-10 lg:space-x-4 bg-base-100 p-4 flex flex-col lg:grid lg:grid-cols-2 items-center lg:justify-items-center">
  <div class="lg:self-start">
    <div class="flex justify-between gap-0 sm:gap-4">
      <p class="font-semibold text-2xl w-32">
        {{moment(firstDayOfMonth).format("MM").toString()}}
        <span class="font-normal text-base pl-2">{{ moment(firstDayOfMonth).format("YYYY").toString() }}</span>
      </p>

      <div class="flex flex-row items-center">
        <button class="btn btn-square btn-sm btn-ghost"  @click="getPrevMonth">
          <ChevronLeft class="w-4 h-4" />
        </button>
        <button class="btn btn-sm btn-ghost normal-case" @click="getCurrentMonth">
        回到当月</button>
        <button class="btn btn-square btn-sm btn-ghost" @click="getNextMonth">
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>        
    
    <div class="my-4 divider" />

    <div class="grid grid-cols-7 gap-6 sm:gap-12 place-items-center">
      <div class="text-xs capitalize" v-for="day in weekdays" :key="day">{{day}}</div>
    </div>
          
    <div class="grid grid-col auto-rows-auto mt-1 place-items-center items-stretch">
      <div v-for="(day, idx) in allDaysInMonth()" :key="idx" :class="colStartClasses[moment(day).day().toString()] + ' border border-solid border-base-content/50 w-full h-16 '">
        <p class="flex items-center justify-center h-8 w-8 rounded-full mx-auto  font-semibold mt-1 text-sm cursor-pointer "
        :class="{'bg-primary text-primary-content': isToday(day), 'text-base-content/50': isDifferentMonth(day),'bg-accent text-accent-content': moment(day).isSame(selectedDate, 'day')}"
        @click="selectedDate = day">
          {{ moment(day).format('D') }}
        </p>
          <div class="h-[25px] w-full text-center font-bold text-primary bg-base-200" v-if="SubcribedList.filter(item => moment(item.startDate).isSame(day, 'day')).length> 0">
            {{ SubcribedList.filter(item => moment(item.startDate).isSame(day, 'day')).length }}
          </div>
      </div>
    </div>
  </div>

  <!-- 小屏日历卡片 -->
  <div>
    <div class="flex max-w-screen-sm flex-col items-center py-10 space-y-2">
      <div v-for="record in SubcribedList.filter(item => moment(item.startDate).isSame(selectedDate, 'day'))" :key="record.id" class="relative">
        <ActivityCard :activity="record"/>
        <button class="btn btn-xs btn-primary btn-outline absolute rounded-box cursor-pointer top-0.5 right-0.5 z-10" @click="unsubscribe(record.id)">取消订阅</button>
      </div>
    </div>
    <div v-if="SubcribedList.filter(item => moment(item.startDate).isSame(selectedDate, 'day')).length == 0">
      <h3 class="text-center text-2xl font-semibold mt-2">暂无订阅活动</h3>
    </div>
  </div>

</div>
</template>