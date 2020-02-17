import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

Vue.use(ElementUI, {
  size: 'small'
})

axios.interceptors.response.use(
  response => {
    if (response.data.code === 'fail' && response.data.message === '未登录，请先登录') {
      localStorage.removeItem('username')
      localStorage.removeItem('nickname')
      localStorage.removeItem('loginStatus')
      Vue.prototype.$message.error('未登录，请先登录')
      router.push({name: 'login'})
    } else return response
  },
  error => {
    return Promise.reject(error)
  }
)
Vue.prototype.axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
