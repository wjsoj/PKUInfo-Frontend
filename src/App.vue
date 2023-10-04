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
  <header>
    <navBar />
  </header>
  <main>
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component"/>
      </transition>
    </router-view>
  </main>
  <footer class="fixed bottom-0 w-full">
    <footerBar />
  </footer>
</template>