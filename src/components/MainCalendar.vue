<script setup>
import { onMounted, ref,watch } from 'vue';
import { ChevronRight, ChevronLeft } from 'lucide-vue-next';
import moment from 'moment';
import { request } from '@/utils/request';
import { useToast } from 'vue-toastification';
import ActivityCard from './ActivityCard.vue';
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
const records = ref([]);

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

const fetchActivities = async () => {
  const startDate = moment(selectedDate.value).startOf('day').format('YYYY-MM-DD');
  const endDate = moment(selectedDate.value).endOf('day').format('YYYY-MM-DD');
  const start = 1;
  const size = 1000;
  const res = await request.get(`/activity/${startDate}/${endDate}/${start}/${size}`).then(res => res.data.data).catch(err => {
    toast.error('获取活动列表失败');
    console.log('err', err);
  });
  records.value = res.records;
}

watch(selectedDate, () => {
  fetchActivities();
})
onMounted(() => {
  fetchActivities();
})

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
<div class="w-full bg-base-100 p-4 rounded-lg">
  <div class="flex  justify-between gap-0 sm:gap-4">
    <p class="font-semibold text-2xl w-32 lg:w-56">
      {{moment(firstDayOfMonth).format("MM").toString()}}
      <span class="font-normal text-base pl-2">{{ moment(firstDayOfMonth).format("YYYY").toString() }}</span>
    </p>

    <div>
      <button class="btn btn-square btn-sm btn-ghost"  @click="getPrevMonth">
        <ChevronLeft class="w-4 h-4" />
      </button>
      <button class="btn btn-sm btn-ghost normal-case" @click="getCurrentMonth">
      Current Month</button>
      <button class="btn btn-square btn-sm btn-ghost" @click="getNextMonth">
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>
  </div>        
  
  <div class="my-4 divider" />

  <div class="grid grid-cols-7 gap-6 sm:gap-12 place-items-center">
    <div class="text-xs capitalize" v-for="day in weekdays" :key="day">{{day}}</div>
  </div>

        
  <div class="grid grid-cols-7 mt-1 place-items-center">
    <div v-for="(day, idx) in allDaysInMonth()" :key="idx" :class="colStartClasses[moment(day).day().toString()] + ' border border-solid border-base-content/50 w-full h-11 lg:h-28'">
      <p class="flex items-center justify-center h-8 w-8 rounded-full mx-1 mt-1 text-sm cursor-pointer hover:bg-base-300"
        :class="{'bg-primary dark:hover:bg-base-300 text-primary-content': isToday(day), 'text-base-content/50': isDifferentMonth(day),'bg-accent text-accent-content hover:bg-accent/30': moment(day).isSame(selectedDate, 'day')}"
        @click="selectedDate = day">
        {{ moment(day).format('D') }}
      </p>
    </div>
  </div>

  <div v-for="record in records" :key="record.id" class="flex flex-col lg:hidden items-center py-10 space-y-2">
    <ActivityCard :activity="record" />
  </div>
  <div class="lg:hidden" v-if="records.length == 0">
    <h3 class="text-center text-2xl font-semibold mt-10">No activities</h3>
  </div>

</div>
</template>