import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Avatar',
    component: () => import('../views/Avatar.vue')
  },
]

const router = createRouter({
  // 创建 base 地址为 process.env.BABEL_URL 的路由配置
  history: createWebHistory('/founy'),
  routes
})

export default router