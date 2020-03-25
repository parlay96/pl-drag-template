import 'babel-polyfill' // 引入填充库,解决IE不能显示的问题
import Vue from 'vue'
import App from './App'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './themes/theme/index.css' // 引入element-ui样式
import store from './vuex'
import Bus from './utils/bus' // 引入bus，用于组件通信
import './config/http' // 拦截器
import './permission' // 权限
import { router } from './config' // 路由
import { Component } from 'vue-property-decorator'
// 引入頁面模块
import moduleData from './module'
// 载入模拟数据，在对接后端服务器接口时，取消掉
moduleData.forEach(item => {
  // 注入模块
  Vue.use(item, { store, router })
})
// 打印插件
Vue.use(ElementUi)
// 必须注入bus
Vue.use(Bus)

Vue.config.productionTip = false
// Adding Custom Hooks
Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate'
])

// 该项目种子特别注重规范，引入了eslint代码检测，在写法上一定要规范
// eslint代码检测，使用它可以避免低级错误和统一代码的风格
// 种子采用模块化写
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
