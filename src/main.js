import Vue from 'vue'
import App from './App.vue'
import VueLazyload from 'vue-lazyload'
import './style.scss'

Vue.config.productionTip = false
Vue.use(VueLazyload);

new Vue({
  render: h => h(App),
}).$mount('#app')
