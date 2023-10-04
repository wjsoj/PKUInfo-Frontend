import { createRouter, createWebHistory } from 'vue-router'
import MainView from '../views/MainView.vue'
// import submitLink from '../components/submitLink.vue'
import CalendarView from '../views/CalendarView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainView
    },
    // {
    //   path: '/submit',
    //   name: 'submit',
    //   component: submitLink
    // },
    {
      path: '/calendar',
      name: 'calendar',
      component: CalendarView
    }
  ]
})

export default router
