import Vue from 'vue'
import App from './App.vue'
import store from "./store"
import HighchartsVue from 'highcharts-vue'

import 'flag-icon-css/css/flag-icon.css'

Vue.config.productionTip = false

Vue.use(HighchartsVue)

Vue.filter('reverse', value => {
    return value.slice().reverse()
})

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
