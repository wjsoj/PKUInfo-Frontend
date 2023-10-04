<script setup>
import timeLine from '../components/timeLine.vue'
import timeCalendar from '../components/timeCalendar.vue'
</script>

<template>
  <div>
    <div class="block md:hidden">
      <timeLine />
    </div>
    <div class="hidden md:block">
      <timeCalendar />
    </div>
  </div>
</template>