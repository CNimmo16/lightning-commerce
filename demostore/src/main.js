import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// form validation
import VeeValidate from 'vee-validate';
Vue.use(VeeValidate, {
  events: 'change'
});
import { Validator } from 'vee-validate';
const dict = {
  custom: {
    email: {
      required: 'Please provide an email address so we can keep in touch about your order'
    },
  }
};

Validator.localize('en', dict);

// toast notifications
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

// loadscript
import LoadScript from 'vue-plugin-load-script';
Vue.use(LoadScript);

// vue select custom select boxes
import vSelect from 'vue-select'
Vue.component('v-select', vSelect)

// axios
import axios from "axios";
const customAxios = axios.create({
  baseURL: '/api/',
});
Vue.prototype.$axios = customAxios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
  provide: () => {
    return {
      notyf: new Notyf({
        duration: 5000 // Set your global Notyf configuration here
      })
    }
  },
}).$mount('#app')
