<script setup>
import { onMounted } from 'vue';

// 监听滚动事件，当footer可见时，向上滚动至footer不可见
onMounted(() => {
  const footer = document.querySelector('footer');
  window.onscroll = function () {
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop + window.innerHeight > footer.offsetTop) {
      setTimeout(() => {
        window.scrollTo({
          top: footer.offsetTop - window.innerHeight + 50,
          behavior: 'smooth'
        });
      }, 200);
    }
  }
});
</script>

<template>
  <footer class="bg-base-200 text-base-content/70  md:mt-0">
    <div class="flex justify-center items-center h-16 font-semibold">
      <p class="text-center">PKU Info 项目组
      <br class="block md:hidden" /> 
      Powered By <span class="tooltip text-primary" data-tip="Linux Club Of Peaking University">LCPU</span> </p>
    </div>
  </footer>
</template>