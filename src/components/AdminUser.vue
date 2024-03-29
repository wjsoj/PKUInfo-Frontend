<script setup>
import { request } from '@/utils/request';
import { onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';
import { encrypt } from '@/utils/aes';
const toast = useToast();
const user = ref([]);
const loading = ref(false);
const selectedUser = ref(-100);
const username = ref('');
const password = ref('');
const dpassword = ref('');

async function fetchUser() {
  user.value = [];
  loading.value = true;
  user.value = await request.get('/admin/user').then(res => res.data.data).catch(() => {
    toast.error('获取用户信息失败');
  });
  loading.value = false;
}

async function deleteUser() {
  request.delete(`/admin/user/${selectedUser.value}`).then(res => {
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
// PUT /admin/register
async function addAdmin() {
  if (password.value !== dpassword.value) {
    toast.error('两次密码不一致');
    return;
  }
  if (username.value === '' || password.value === '') {
    toast.error('用户名或密码不能为空');
    return;
  }
  request.put('/admin/register', {
    username: username.value,
    password: encrypt(password.value)
  }).then(res => {
    if (res.data.code === 200) {
      toast.success('添加成功');
    } else {
      toast.error('添加失败 code'+res.data.code);
    }
  }).catch(() => {
    toast.error('添加失败');
  });
}

onMounted(() => {
  fetchUser();
});
</script>

<template>
<dialog id="deleteConfirm" class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">警告</h3>
    <p class="py-4">将要删除id为{{ selectedUser }}的用户</p>
    <div class="modal-action">
      <form method="dialog">
        <button class="btn btn-error mr-2" @click="deleteUser()">确定</button>
        <button class="btn">取消</button>
      </form>
    </div>
  </div>
</dialog>

<dialog id="addAdmin" class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">管理员注册</h3>
    <form method="dialog">
      <div class="form-control">
        <label class="label">
          <span class="label-text">用户名</span>
        </label>
        <input type="text" class="input" v-model="username" placeholder="请输入用户名" />
      </div>
      <div class="form-control">
        <label class="label">
          <span class="label-text">密码</span>
        </label>
        <input type="password" class="input" v-model="password" placeholder="请输入密码" />
        <label class="label">
          <span class="label-text">确认密码</span>
        </label>
        <input type="password" class="input" v-model="dpassword" placeholder="请输入密码" />
      </div>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn btn-primary mr-4" @click="addAdmin">确定</button>
          <button class="btn" >取消</button>
        </form>
      </div>
    </form>
  </div>
</dialog>

<div class="my-10">
  <button class="mx-auto btn w-2/5 ml-10 btn-primary btn-outline" onclick="addAdmin.showModal()">管理员注册</button>
  <table class="table mt-4">
    <thead>
      <tr class="text-lg font-semibold text-base-content">
        <th>用户名</th>
        <th>id</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="loading">
        <td colspan="3" class="text-center">
          <span class="loading loading-dots loading-lg"></span>
        </td>
      </tr>
      <tr v-for="item in user" :key="item.userId">
        <td class="text-base">{{ item.username }}</td>
        <td class="text-base">{{ item.userId }}</td>
        <td>
          <button class="btn btn-xs btn-error" @click="selectedUser = item.userId" onclick="deleteConfirm.showModal()">删除</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
</template>