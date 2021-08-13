import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import plugins from '../packages/index'
import ruleVerify from 'ele-form-verify'
Vue.use(ElementUI)
Vue.use(plugins)
// Vue.use(QueryForm)
// 全局方法挂载
Vue.prototype.ruleVerify = ruleVerify
Vue.config.productionTip = false
Vue.filter('NumFormat', (val) => {
  if (val) {
    const intPart = val.toString().split('.')[0] // 获取整数部分
    const floatPart = val.toString().indexOf('.') ? Math.abs(val).toString().split('.')[1] ? Math.abs(val).toString().split('.')[1] : '00' : '00'// 获取小数部分
    const intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
    const numberFormat = `${intPartFormat}.${floatPart}`
    return numberFormat
  } else {
    return '0.00'
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
