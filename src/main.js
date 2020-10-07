import Vue from 'vue'
import App from './App.vue'

import less from 'less'
Vue.use(less)

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import './assets/css/base.css';
import Axios from 'axios';

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
