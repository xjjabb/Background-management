import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js';

import less from 'less'
Vue.use(less)

import './assets/fonts/iconfont.css';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import './assets/css/base.css';
import './assets/css/global.css';

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
