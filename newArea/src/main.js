import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import service from './service'
import * as echarts from 'echarts'

Vue.prototype.axios = axios;
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
Vue.prototype.service = service//service挂载到原型上
Vue.use(ElementUI);

new Vue({
  router,
  el: '#app',
  store,
  render: h => h(App)
}).$mount('#app')
