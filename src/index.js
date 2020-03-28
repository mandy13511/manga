import Vue from 'vue'
import list from './list.vue'
//import hello from './hello.vue'

new Vue({
  el: '#app',
  mounted : function(){
    console.log('Hello World');

  },
  components: { list },
  template: '<list/>'
})
