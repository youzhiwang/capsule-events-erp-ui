import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/index.vue')
  },
  {
    path: '/',
    name: 'layout',
    component: () => import('../views/layout/index.vue'),
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('../views/home/index.vue')
      },
      {
        path: 'brand-manage',
        name: 'brandManage',
        component: () => import('../views/brand-manage/index.vue')
      },
      {
        path: 'subclass/:id/:brandName',
        name: 'subclass',
        component: () => import('../views/subclass/index.vue')
      },
      {
        path: 'commodity-manage',
        name: 'commodityManage',
        component: () => import('../views/commodity-manage/index.vue')
      },
      {
        path: 'cost-manage',
        name: 'costManage',
        component: () => import('../views/cost-manage/index.vue')
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
