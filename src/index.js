import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/permission' // 权限控制
import * as mUtils from '@/common/js/mUtils'
import config from '@/config'
import filters from './filters/index'
import userModel from '@/mixins/userModel'

import Element from 'element-ui'
import '@/common/styles/element-variables.scss'
import '@/common/styles/index.scss' // 自定义 css
import 'animate.css'
import VueClipboard from 'vue-clipboard2'

Vue.use(Element);
Vue.use(VueClipboard)

/**
 * 引入公共方法mUtils
 */
Vue.prototype.$mUtils = mUtils;

/**
 * 公共配置信息
 */
Vue.prototype.$config = config

// 注册全局过滤器
Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key])
})

// 全局注册mixins
Vue.mixin(userModel); // 公共mixins


String.prototype.replaceAll = function(s1, s2) {
	return this.replace(new RegExp(s1, "gm"), s2);
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
