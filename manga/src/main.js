import Vue from 'vue'
import App from './App.vue'
import VueLazyload from 'vue-lazyload'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"

Vue.config.productionTip = false
Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.use(VueLazyload);

new Vue({
  render: h => h(App),
}).$mount('#app')
