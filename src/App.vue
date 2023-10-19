<script setup>
import { RouterView } from 'vue-router'
import navBar from './components/navBar.vue'
import footerBar from './components/footerBar.vue'
import { onMounted } from 'vue'
import { useStore } from './stores'
const store = useStore()
onMounted(() => {
  store.initFetchData()
})
</script>

<template>
<div class="flex flex-col min-h-screen">
  <header>
    <navBar />
  </header>
  <main class="flex-grow">
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component"/>
      </transition>
    </router-view>
  </main>
  <footer class="w-full">
    <footerBar />
  </footer>
</div>
</template>