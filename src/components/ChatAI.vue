<script setup>
const { message } = defineProps(['message']);
const emit = defineEmits(['changeQuote']);
import { ref,watch } from 'vue';
import MarkdownIt from 'markdown-it';

let renderedMarkdown = ref('');
const md = new MarkdownIt();

watch(() => message.answer, () => {
  renderedMarkdown.value = md.render(message.answer);
});
</script>

<template>
  <div class="flex flex-row justify-start space-x-2 lg:space-x-4 items-center mb-2 text-[10px] lg:text-xs">
    <img
      class="mr-2 flex h-8 rounded-full"
      src="https://dummyimage.com/256x256/354ea1/ffffff&text=AI"
    />
    <!-- 状态框，圆角矩形，显示状态 -->
    <div class="px-2 lg:px-4 lg:py-1 bg-gradient-to-br from-primary/30 to-accent/30 text-base-content font-semibold rounded-2xl">
      {{ message.status }}
    </div>
    <p v-if="message.quote.length" class="cursor-pointer bg-primary/70 text-primary-content lg:py-1 font-semibold rounded-2xl px-2" @click="emit('changeQuote',message.quote)" onclick="knowledge.showModal()">
      知识库引用：{{ message.quote.length }}条
    </p>
    <p v-if="message.time" class="lg:py-1 bg-accent/70 text-accent-content font-semibold rounded-2xl px-2">
      {{ message.time }}s
    </p>
  </div>
  <div class="flex items-center rounded-xl">
    <p class="answer" v-html="renderedMarkdown">
    </p>
  </div>
</template>

<style>
.answer h1 {
  font-size: 1.5rem;
  font-weight: 1000;
  line-height: 1.7;
  margin-bottom: 0.4rem;
}
.answer h2 {
  font-size: 1.25rem;
  font-weight: 800;
  line-height: 1.6;
  margin-bottom: 0.3rem;
}
.answer h3 {
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.5;
  margin-bottom: 0.2rem;
}
.answer h4 {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 0.1rem;
}
</style>