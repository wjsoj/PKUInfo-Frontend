<script setup>
import { request } from '@/utils/request';
import { onMounted, ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import ActivityDetail from './ActivityDetail.vue';
const toast = useToast();
const Activities = ref([]);
const loading = ref(false);
const selectedActivity = ref({});
const keywords = ref('');
const newActivity = ref({});

async function fetchUser() {
  Activities.value = [];
  loading.value = true;
  let res = await request.get('/admin/activity').then(res => res.data.data).catch(() => {
    toast.error('获取活动信息失败');
  });
  // 按title排序
  Activities.value = res.sort((a, b) => a.title.localeCompare(b.title));
  loading.value = false;
}

async function deleteActivity() {
  request.delete(`/admin/activity/${selectedActivity.value.id}`).then(res => {
    if (res.data.code === 200) {
      toast.success('删除成功');
      fetchUser();
    } else {
      toast.error('删除失败');
    }
  }).catch(() => {
    toast.error('删除失败');
  });
}
// PUT /admin/activity body: newActivity
async function changeActivity() {
  console.log(newActivity.value);
  request.put('/admin/activity', newActivity.value).then(res => {
    if (res.data.code === 200) {
      toast.success('修改成功');
      fetchUser();
    } else {
      toast.error('修改失败');
    }
  }).catch(() => {
    toast.error('修改失败');
  });
}
// 检测title重复
function isDuplicated(activity) {
  return Activities.value.filter((item) => item.title === activity.title).length > 1;
}

onMounted(() => {
  fetchUser();
});
watch(keywords, (newVal) => {
  if (newVal) {
    Activities.value = Activities.value.filter((item) => item.title.includes(newVal));
  } else {
    fetchUser();
  }
});
</script>

<template>
<dialog id="deleteconfirm" class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">警告</h3>
    <p class="py-4">将要删除名称为<span class="text-info font-semibold">{{ selectedActivity.title }}</span>的活动</p>
    <div class="modal-action">
      <form method="dialog">
        <button class="btn btn-error mr-2" @click="deleteActivity()">确定</button>
        <button class="btn">取消</button>
      </form>
    </div>
  </div>
</dialog>
<dialog id="modifyconfirm" class="modal">
  <div class="modal-box max-w-[72vw]">
    <h3 class="font-bold text-xl">修改活动</h3>
    <div class="grid grid-cols-2 gap-6">
      <div class="flex flex-col">
        <label class="label">标题</label>
        <input type="text" class="input input-bordered w-full" v-model="newActivity.title" />
        <label class="label">地点</label>
        <input type="text" class="input input-bordered w-full" v-model="newActivity.address" />
        <label class="label">举办单位</label>
        <input type="text" class="input input-bordered w-full" v-model="newActivity.college" />
      </div>
      <div>
        <label class="label">描述</label>
        <textarea type="text" class="textarea textarea-bordered w-full min-h-56" v-model="newActivity.description" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="label">开始日期</label>
          <input type="date" class="input input-bordered w-full" v-model="newActivity.startDate" />
        </div>
        <div>
          <label class="label">开始时间</label>
          <input type="time" class="input input-bordered w-full" v-model="newActivity.startTime" />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="label">结束日期</label>
          <input type="date" class="input input-bordered w-full" v-model="newActivity.endDate" />
        </div>
        <div>
          <label class="label">结束时间</label>
          <input type="time" class="input input-bordered w-full" v-model="newActivity.endTime" />
        </div>
      </div>
    </div>
    <div class="modal-action">
      <form method="dialog">
        <button class="btn btn-error mr-2" @click="changeActivity()">确定</button>
        <button class="btn">取消</button>
      </form>
    </div>
  </div>
</dialog>

<div class="my-10">
  <!-- 搜索框 -->
  <label class="input input-bordered flex items-center gap-2 mb-10">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path fill-rule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd" /></svg>
    <input type="text" class="grow" v-model="keywords" placeholder="Search" />
  </label>
  <div v-for="activity in Activities" :key="activity.id" class="flex flex-col items-center">
    <div class="flex flex-row justify-between w-full">
      <div class="grow self-start text-lg font-bold">{{ activity.title }}</div>
      <div v-if="isDuplicated(activity)" class="text-error font-semibold self-end text-nowrap">标题重复</div>
      <button class="btn btn-xs lg:btn-sm btn-outline btn-primary self-end ml-2" @click="selectedActivity = activity" onclick="deleteconfirm.showModal()">删除</button>
      <button class="btn btn-xs lg:btn-sm btn-secondary self-end ml-2" @click="selectedActivity = activity;newActivity = activity" onclick="modifyconfirm.showModal()">修改</button>
    </div>
    <div tabindex="0" class="collapse"> 
      <div class="collapse-title text-sm font-medium text-info mt-[-8px]">
        详情
      </div>
      <div class="collapse-content"> 
        <ActivityDetail :activity="activity" />
      </div>
    </div>
  </div>
  <div v-if="loading" class="text-center">
    <span class="loading loading-dots loading-lg"></span>
  </div>
</div>
</template>