<script setup>
import SubmitArticle from '@/components/SubmitArticle.vue';
import SubmitAccount from '@/components/SubmitAccount.vue';
import { ref } from 'vue';
const active = ref('article');
</script>

<template>
  <div class="flex flex-col h-full items-center">
    <div class="flex space-x-2 justify-center mt-10">
      <div class="btn" :class="active === 'article' ? 'btn-secondary scale-105' : ''" @click="active = 'article'">提交文章</div>
      <div class="btn" :class="active === 'account' ? 'btn-secondary scale-105' : ''" @click="active = 'account'">提交公众号</div>
    </div>
    <div v-if="active === 'article'">
      <SubmitArticle />
    </div>
    <div v-else>
      <SubmitAccount />
    </div>
  </div>
</template>