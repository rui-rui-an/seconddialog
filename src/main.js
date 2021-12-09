import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import BaseConfirmPop from '@/components/BaseConfirmPop.vue'
import VmodelConfirmPop from '@/components/VmodelConfirmPop.vue'
Vue.component('ConfirmPop', BaseConfirmPop)
Vue.component('VmodelConfirmPop', VmodelConfirmPop)
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
