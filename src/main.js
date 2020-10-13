import Vue from 'vue'
import App from './App.vue'
import router from './router';
import 'element-ui/lib/theme-chalk/index.css';
import elementUi from 'element-ui';
import { checkToken, success_code } from "./api/api";
import constants from "./utils/constants";
Vue.prototype.$constant = constants;
Vue.config.productionTip = false;
Vue.use(elementUi);
router.beforeEach((to, from, next) => {
  if (to.path === "/login") {
    next();
  } else {
    checkToken().then(result => {
      if (result.code === success_code) {
        window.localStorage.setItem('avatar',result.data.avatar);
        window.localStorage.setItem('userName',result.data.userName);
        if (result.data.roles === "role_admin") {
          next();
        }
      } else {
        location.href = "https://www.baidu.com";
      }
    });
  }
});
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
