<script setup>
import { ref,watch,nextTick } from 'vue';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useToast } from 'vue-toastification';
import ChatAI from './ChatAI.vue'
import { problemList } from './constant'

const toast = useToast();
let messages = ref([])
let quoting = ref(null)
let messageInput = ref('')
let inputContainer = ref(null)
let id = ref(0)
let loading = ref(false)
let regenerating = ref(false)
let ctrl = new AbortController();

// function getQuote(quote) {
//   quoting.value = quote
// }
// \n替换为html空格
function processString(str) {
  return str.replace(/\/n/g, '<br/>');
}
function getResponse(message,mid = messages.value.length - 1) {
  class RetriableError extends Error { }
  class FatalError extends Error { }

  if (sessionStorage.getItem('auth') === null) {
    toast.error('未登录，请先登录');
    return;
  }
  // /api/auth/stream/chat

  fetchEventSource('https://fastgpt.wjsphy.top/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer fastgpt-e8xpZ8vdkcLWuUFhP7ilNJsgUWvqZoFQkRucaFaCksgrXBdfdsDPXK4d1vdCeG`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chatId: 'test12356',
      stream: true,
      detail: true,
      // variables: {
      //   cTime: `${new Date().toISOString().split('T')[0]} ${new Date().toTimeString().split(' ')[0]} ${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date().getDay()]}`
      // },
      messages: [
        {
          content: message,
          role: 'user'
        }
      ]
    }),
    openWhenHidden: true,
    signal: ctrl.signal,
    async onopen(response) {
      if (response.ok) {
        return; // everything's good
      } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        // client-side errors are usually non-retriable:
        toast.error('对话接口调用失败');
        throw new FatalError();
      } else {
        toast.error('对话接口调用失败，正在重试');
        throw new RetriableError();
      }
    },
    onmessage(msg) {
      // console.log(msg)
      if (msg.data === '[DONE]') {
        messages.value[mid].status = "对话完成"
        loading.value = false
        if (regenerating.value) {
          setTimeout(() => {
            regenerating.value = false
          }, 300);
        }
        return;
      }
      let data = JSON.parse(msg.data);
      switch (msg.event) {
        case 'flowResponses': {
          if (data[0].quoteList)
            messages.value[mid].quote=data[0].quoteList
          if (data[1].quoteList)
            messages.value[mid].quote=data[1].quoteList
          messages.value[mid].time = data.reduce((acc, cur) => {
            return acc + cur.runningTime
          }, 0)
          messages.value[mid].time = messages.value[mid].time.toFixed(2)
          inputContainer.value.focus()
          break;
        }
        case 'toolCall': {
          messages.value[mid].status += ' ' + data.tool.toolName
          break;
        }
        case 'toolParams':
          break;
        case 'toolResponse':
          break;
        case 'flowNodeStatus': {
          messages.value[mid].status = data.name
          break;
        }
        case 'error':
          throw new FatalError(msg.data);
        default: {
          if (data.choices[0].finish_reason == null) {
            messages.value[mid].answer += data.choices[0].delta.content
          } else {
            if (data.choices[0].finish_reason != 'stop') {
              console.error('Unexpected finish reason:', data.choices[0].finish_reason);
            }  
          }
        }
      }
    },
    onerror(err) {
      if (err instanceof FatalError) {
        toast.error('对话接口调用失败');
        throw err; // rethrow to stop the operation
      } else {
      // do nothing to automatically retry. You can also
      }
    }
  });
  return '正在思考中...'
}
function forceStop() {
  loading.value = false
  ctrl.abort();
  messages.value[messages.value.length - 1].status = "对话已被强行终止"
}

function sendMessage() {
  if (loading.value) {
    toast.warning('请等待当前对话完成');
    return;
  }
  if (messageInput.value.trim() === '') {
    toast.error('请输入提问内容');
    return;
  }
  // chatContainer滚动到底部
  messages.value.push({
    id: id.value++,
    ask: messageInput.value,
    answer: '',
    status: '开始处理...',
    quote: [],
    time: 0
  })
  loading.value = true
  getResponse(messageInput.value)
  messageInput.value = ''
}
function initProblem(problem) {
  messageInput.value = problem
  sendMessage()
}

function refresh() {
  messages.value = []
  id.value = 0
  ctrl = new AbortController();
}
function copyContent(message) {
  navigator.clipboard.writeText(message.answer).then(() => {
    toast.success('已复制到剪贴板');
  }).catch(() => {
    toast.error('复制失败');
  });
}
function regenerate(mid) {
  messages.value[mid].answer = ''
  messages.value[mid].status = '开始处理...'
  messages.value[mid].time = 0
  loading.value = true
  regenerating.value = true
  getResponse(messages.value[mid].ask,mid)
}

// 有新对话时滚动到当前变化发生的位置
watch(messages, () => {
  nextTick(() => {
    if (!regenerating.value) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }
  })
},{
  deep: true
});
// 输入框自适应高度
watch(messageInput, () => {
  inputContainer.value.style.height = 'auto';
  inputContainer.value.style.height = inputContainer.value.scrollHeight + 'px';
});
</script>

<template>
<dialog id="knowledge" class="modal">
  <div class="modal-box">
    <h2 class="font-semibold text-xl mb-2">知识库引用：</h2>
    <div class="flex flex-col text-xs space-x-2 my-2" v-for="(know,index) in quoting" :key="know.id">
      <p class="font-semibold text-nowrap">{{ (index+1)+'. '+know.sourceName }}：</p>
      <p >{{ processString(know.q+' '+know.a) }}</p>
    </div>
    <div class="modal-action">
    <form method="dialog">
      <button class="btn">Close</button>
    </form>
  </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>


<!-- Prompt Messages Container - Modify the height according to your need -->
<div class="flex h-full min-h-[90vh] bg-base-200/50 w-full lg:px-24 lg:py-6 flex-col">
  <!-- Prompt Messages -->
  <div v-if="messages.length === 0" class="flex flex-col items-center justify-center border-[0.5px] border-primary shadow-lg bg-gradient-to-br from-base-100 to-primary/10 rounded-2xl mx-4 px-4 py-10 lg:p-10 mt-4 md:mt-24">
    <h1 class="text-2xl font-semibold text-primary">PKU Info AI 小助手</h1>
    <div class="flex flex-col items-center md:items-start md:grid md:grid-cols-3 space-x-8 justify-center mt-4">
      <img src="/illustration.png" alt="Illustration" class="w-2/3 mb-4" />
      <div class="flex flex-col space-y-1 w-full">
        <h2 class="font-semibold text-xl my-2">校园生活</h2>
        <p class=" text-sky-600 cursor-pointer hover:underline" v-for="(problem,index) in problemList[0]" :key="index" @click="initProblem(problem)">
          {{ problem }}
        </p>
      </div>
      <div class="flex flex-col space-y-1 w-full">
        <h2 class="font-semibold text-xl my-2">不实用小工具</h2>
        <p class=" text-sky-600 cursor-pointer hover:underline" v-for="(problem,index) in problemList[1]" :key="index" @click="initProblem(problem)">
          {{ problem }}
        </p>
      </div>
    </div>
  </div>

  <div
    class="overflow-y-scroll rounded-xl p-4 text-sm leading-6 text-base-content flex flex-col justify-start justify-items-start sm:text-base sm:leading-7 mb-12"
  >
    <template v-for="message in messages" :key="message.id">
      <div class="flex flex-row px-2 pt-2 sm:px-4">
        <img
          class="mr-2 flex h-8 w-8 rounded-full sm:mr-4"
          src="https://dummyimage.com/256x256/363536/ffffff&text=U"
        />

        <div class="flex max-w-3xl text-base-content/80 items-center">
          <p>{{ message.ask }}</p>
        </div>
      </div>
      <!-- 提问后的图标栏 -->
      <div class="mb-2 flex w-full flex-row justify-end gap-x-2 text-slate-500">
        <button class="hover:text-blue-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path
              d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3"
            ></path>
          </svg>
        </button>
        <button class="hover:text-blue-600" type="button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path
              d="M7 13v-8a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v7a1 1 0 0 0 1 1h3a4 4 0 0 1 4 4v1a2 2 0 0 0 4 0v-5h3a2 2 0 0 0 2 -2l-1 -5a2 3 0 0 0 -2 -2h-7a3 3 0 0 0 -3 3"
            ></path>
          </svg>
        </button>
        <button class="hover:text-blue-600" type="button" @click="copyContent(message)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path
              d="M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z"
            ></path>
            <path
              d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"
            ></path>
          </svg>
        </button>
        <button class="hover:text-blue-600" type="button" @click="regenerate(message.id)">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
        </button>
      </div>
      <!-- AI回答 -->
      <div
        class="mb-2 flex flex-col overflow-x-hidden rounded-xl bg-base-100 px-2 py-6 sm:px-4 transition-all ease-in-out duration-300"
      >
        <ChatAI :message="message" />
        <!-- <ChatAI :message="message" @change-quote="getQuote" /> -->
      </div>
    </template>
  </div>
  <!-- 输入框 -->
  <div class="mt-2 fixed bottom-4 left-0 w-full px-2 lg:px-20">
    <label for="chat-input" class="sr-only">Enter your prompt</label>
    <div class="relative">
      <button
        type="button"
        class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-500"
        @click="refresh"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m14.622 17.897-10.68-2.913"/><path d="M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z"/><path d="M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15"/></svg>
        <span class="sr-only">Start a new conversation</span>
      </button>
      <textarea
        id="chat-input"
        class="block w-full max-h-96 resize-none rounded-xl border-none p-4 pl-10 pr-20 text-sm  focus:outline-none focus:ring-2 focus:ring-blue-500  dark:placeholder-slate-400 dark:bg-primary dark:focus:ring-blue-500 sm:text-base"
        placeholder="Enter your prompt"
        v-model="messageInput"
        rows="1"
        @keyup.enter="sendMessage"
        @keydown.enter.prevent
        ref="inputContainer"
      ></textarea>
      <button
        type="submit"
        class="absolute bottom-2 right-2.5 rounded-lg bg-blue-700 px-4 text-sm font-medium text-slate-200 hover:bg-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:text-base py-2"
        @click="sendMessage"
        v-if="!loading"
      >
        Send
        <span class="sr-only">Send message</span>
      </button>
      <button
        type="button"
        class="absolute bottom-2 right-2.5 rounded-lg bg-blue-700 px-6 text-sm font-medium text-slate-200 hover:bg-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:text-base py-2"
        @click="forceStop"
        v-else
      >
        <!-- stop，停止的图标，使用daisyui mask -->
        <div class="mask mask-square bg-slate-200 h-5 w-5"></div>
        <span class="sr-only">Force Stop</span>
      </button>
    </div>
  </div>
</div>
</template>