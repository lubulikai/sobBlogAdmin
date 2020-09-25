import Vue from 'vue'
import App from './App.vue'
import router from './router';
import 'element-ui/lib/theme-chalk/index.css';
import elementUi from 'element-ui';

Vue.config.productionTip = false

Vue.use(elementUi);
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
