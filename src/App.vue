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

const noremind = () => {
  localStorage.setItem('noreminder2', 'true');
}

const themeSupport = window.CSS.supports('color', 'oklch(0 0 0)');

let deferredPrompt = null;

async function installPWA() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the A2HS prompt');
      localStorage.setItem('noreminder2', 'true');
    } else {
      console.log('User dismissed the A2HS prompt');
    }
    deferredPrompt = null;
  }
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
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('beforeinstallprompt Event fired');
    e.preventDefault();
    deferredPrompt = e;
    if (!localStorage.getItem('noreminder2')) {
      document.getElementById('popdialog').showModal();
    }
  });
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
        <h3 class="font-bold text-2xl">PKU Info PWA</h3>
        <p class="text-lg">网站现已支持PWA技术，安装至桌面已获得更便捷的体验！</p>
        <p class="text-sm text-base-content/70">点击安装以开启浏览器内置弹窗，在Safari上可能失效。</p>
        <!-- <img src="/groupqrcode.png" class="lg:w-4/5 self-center" alt="groupQRcode" @click="downImage" /> -->
        <div class="modal-action">
          <form method="dialog">
            <button class="btn btn-sm btn-primary" @click="noremind">不再提醒并关闭</button>
            <button class="btn btn-sm ml-4" @click="installPWA">立即安装</button>
          </form>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>

    <RouterView />
    <!-- backtotop button  -->
    <div class="hidden fixed bottom-20 lg:bottom-12 right-4 cursor-pointer z-50" id="backTop">
      <button class="btn btn-circle btn-accent bg-opacity-70" @click="scrollToTop">
        <ArrowBigUpDash />
      </button>
    </div>
  </div>
</template>
