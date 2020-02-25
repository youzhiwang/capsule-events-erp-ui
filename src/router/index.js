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
    redirect: {name: 'home'},
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
        path: 'activity-price/:commodityId/:commodityName',
        name: 'activityPrice',
        component: () => import('../views/activity-price/index.vue')
      },
      {
        path: 'cost-manage',
        name: 'costManage',
        component: () => import('../views/cost-manage/index.vue')
      },
      {
        path: 'storage-in',
        name: 'storageIn',
        component: () => import('../views/erp-manage/storage-in/storageIn.vue')
      },
      {
        path: 'storage-out',
        name: 'storageOut',
        component: () => import('../views/erp-manage/storage-out/storageOut.vue')
      },
      {
        path: 'remaining-query',
        name: 'remainingQuery',
        component: () => import('../views/erp-manage/remaining-query/remainingQuery.vue')
      },
      {
        path: 'remaining-change-log/:commodityId',
        name: 'remainingChangeLog',
        component: () => import('../views/erp-manage/remaining-query/remaining-change-log/remainingChangeLog.vue')
      },
      {
        path: 'version-manage',
        name: 'versionManage',
        component: () => import('../views/version-manage/versionManage.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name === 'login') {
    const loginStatus = localStorage.getItem('loginStatus')
    if (loginStatus) next({name: 'home'})
    else next()
  } else {
    const loginStatus = localStorage.getItem('loginStatus')
    if (loginStatus) next()
    else next({name: 'login'})
  }
})

export default router
