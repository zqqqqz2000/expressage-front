import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import BaiduMap from 'vue-baidu-map'
import "element-ui/lib/theme-chalk/index.css"

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(VueAxios, axios)
Vue.use(ElementUI)
Vue.use(BaiduMap, {
  ak: 'tfPw8oxBsErz3o43dkax0gOuTWn6YtzI'
})

router.beforeEach((to, from, next) => {
  if (to.path !== from.path) {
    next();
  }
});

export let vue = new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
