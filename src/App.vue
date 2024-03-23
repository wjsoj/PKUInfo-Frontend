<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue';
import { ArrowBigUpDash } from 'lucide-vue-next';
import { onMounted } from 'vue';
import { clickEffect } from './utils/firework';

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// open Image /groupqrcode.png in new tab
function downImage() {
  const a = document.createElement('a');
  a.href = '/groupqrcode.png';
  a.download = 'groupqrcode.png';
  a.click();
}
const noremind = () => {
  localStorage.setItem('noreminder', 'true');
}

const themeSupport = window.CSS.supports('color', 'oklch(0 0 0)');

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
  if (!localStorage.getItem('noreminder')) {
    document.getElementById('popdialog').showModal();
  }
});
</script>

<template>
  <header class="z-10">
    <NavBar />
  </header>
  <div v-if="themeSupport" class="fixed z-0 top-0 right-0 w-[250px] lg:w-[1000px] lg:h-[600px] h-[660px] bg-gradient-to-bl from-primary/10 to-accent/10 blur-3xl rounded-bl-full"></div>
  <div class="grow flex flex-col relative">
    <!-- reminder -->
    <dialog id="popdialog" class="modal">
      <div class="modal-box flex flex-col">
        <h3 class="font-bold text-2xl">PKU Info用户群</h3>
        <p class="text-lg">我们正在持续迭代版本，期待听到您的意见！</p>
        <p class="text-sm text-base-content/70">点击图片可保存到本地，“不再提醒”功能在无痕模式下可能失效</p>
        <img src="/groupqrcode.png" class="lg:w-4/5 self-center" alt="groupQRcode" @click="downImage" />
        <div class="modal-action">
          <form method="dialog">
            <button class="btn btn-sm btn-primary" @click="noremind">不再提醒并关闭</button>
            <button class="btn btn-sm ml-4">关闭</button>
          </form>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
    <RouterView />
    <!-- backtotop button  -->
    <div class="hidden fixed bottom-4 lg:bottom-12 right-4 cursor-pointer z-50" id="backTop">
      <button class="btn btn-circle btn-accent bg-opacity-70" @click="scrollToTop">
        <ArrowBigUpDash />
      </button>
    </div>
  </div>
</template>
