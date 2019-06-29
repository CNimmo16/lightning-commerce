import Vue from 'vue'
import App from './App.vue'
import router from './router'

// element ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en'
Vue.use(ElementUI, { locale })

// axios
import axios from "axios";

const customAxios = axios.create({
  baseURL: '/api/admin/',
});
Vue.prototype.$axios = customAxios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
