<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue';
import { ArrowBigUpDash } from 'lucide-vue-next';
import { onMounted } from 'vue';
import { clickEffect } from './utils/firework';
import { useToast } from 'vue-toastification';
const toast = useToast();

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

onMounted(() => {
  // 当滑动距离大于100时显示返回顶部按钮
  window.onscroll = function () {
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop > 150) {
      document.querySelector('#backTop').style.display = 'block';
    } else {
      document.querySelector('#backTop').style.display = 'none';
    }
  }
  clickEffect();
  // 如果识别到data-theme属性，发出提示
  if (document.documentElement.getAttribute('data-theme')) {
    toast.info('当前浏览器手动主题切换可能失效，将自动跟随系统主题');
  }

});
</script>

<template>
  <header>
    <NavBar />
  </header>

  <div class="grow flex flex-col ">
    <RouterView />
    <!-- backtotop button  -->
    <div class="hidden fixed bottom-4 lg:bottom-12 right-4 cursor-pointer z-50" id="backTop">
      <button class="btn btn-circle btn-accent bg-opacity-70" @click="scrollToTop">
        <ArrowBigUpDash />
      </button>
    </div>
  </div>
</template>
