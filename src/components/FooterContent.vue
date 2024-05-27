<script setup>
// // 监听滚动事件，当滚动到底部时，延迟3s移出页脚，向上滚动则恢复页脚
// onMounted(() => {
//   const footer = document.querySelector('footer');
//   window.addEventListener('scroll', () => {
//     if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 100) {
//       setTimeout(() => {
//         // 将footer向下移出屏幕
//         footer.style.transform = 'translateY(100%)';
//         footer.style.display = 'none';
//       }, 1000);
//     } else {
//       setTimeout(() => {
//         footer.style.display = 'block';
//         footer.style.transform = 'translateX(0)';
//       }, 1000);
//     }
//   });
// });
</script>

<template>
  <footer class="bg-base-200 text-base-content/70 md:mt-0 transition-all ease-in-out">
    <div class="flex justify-center items-center h-20 font-semibold">
      <p class="text-center">
        PKU Info 项目组
        <br class="block md:hidden" /> 
        Powered By <span class="tooltip text-primary" data-tip="Linux Club Of Peking University">LCPU</span> 
      </p>
    </div>
  </footer>
</template>