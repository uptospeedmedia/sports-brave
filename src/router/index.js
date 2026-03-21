import { createRouter, createWebHashHistory } from 'vue-router'
import ScoresView from '../views/ScoresView.vue'
import StreamingView from '../views/StreamingView.vue'
import BettingView from '../views/BettingView.vue'
import HomeView from '../views/HomeView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/scores', component: ScoresView },
  { path: '/streaming', component: StreamingView },
  { path: '/betting', component: BettingView },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router