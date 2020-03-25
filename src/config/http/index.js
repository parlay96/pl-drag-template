import store from '@/vuex'
import Vue from 'vue'
import { AjaxPlugin } from '../../plugins'
import { router } from '@/config'
import { Message } from 'element-ui'

let proxyAddress = ''
// 开发
if (process.env.NODE_ENV === 'development') {
  proxyAddress = CONTEXT_PATH + 'erp'
  // 线上
} else if (process.env.NODE_ENV === 'production') {
  proxyAddress = '/erp'
}

Vue.use(AjaxPlugin)

let [reqNumber, errArr] = [0, []] // 计数请求与报错集合

Vue.http.defaults.baseURL = proxyAddress
Vue.http.interceptors.request.use(config => {
  let url = config.url
  // get参数编码
  if (config.method === 'get' && config.params) {
    url += '?'
    let keys = Object.keys(config.params)
    for (let key of keys) {
      if (config.params[key]) {
        url += `${key}=${encodeURIComponent(config.params[key])}&`
      }
    }
    url = url.substring(0, url.length - 1)
    config.params = {}
  }
  config.url = url
  config.headers['Authorization'] = store.state.token.token
  const data = config.data || {}
  if (!data.noLoading) {
    store.commit('loading')
  }
  reqNumber++
  return config
}, error => {
  return Promise.reject(error)
})

Vue.http.interceptors.response.use(response => {
  store.commit('loadingComplete')
  reqNumber--
  if (response.status >= 200 && response.status <= 300) {
    if (response.data.code && response.data.code !== '0') { // 不成功的状态
      // 收集报错消息
      errArr = [...new Set([...errArr, response.data.msg])]
      // 计数为零时报错
      if (reqNumber === 0) {
        errArr.forEach((msg, dex) => {
          Message.error({ showClose: true, message: msg, duration: 2000, offset: (dex + 1) * 20 })
        })
        errArr = []
      }
      if (response.data.code === 'NO_AUTH' || response.data.code === 'NO_AUTHC') { // 没有登录
        store.commit('REMOVETOKEN')
        router.push({ path: '/login' })
      } else if (response.data.code === 'TENANT_EXPIRE') { // 租户过期
        store.commit('REMOVETOKEN')
        router.push({ path: '/login' })
      } else if (response.data.code === 'TENANT_FORBIDDEN_ACCOUNT') { // 账户被禁用
        store.commit('REMOVETOKEN')
        router.push({ path: '/login' })
      } else if (response.data.code === 'SAAS_FORBIDDEN_ACCOUNT') { // 账户被禁用
        store.commit('REMOVETOKEN')
        router.push({ path: '/login' })
      } else if (response.data.code === 'TOKEN_EXPIRE') { // token过期
        // store.dispatch('refreshToken')
        store.commit('REMOVETOKEN')
        router.push({ path: '/login' })
      } else {
        return response
      }
    }
    return response
  }
}, error => {
  store.commit('loadingComplete')
  reqNumber--
  // responseError(error.response.data || {})
  return Promise.reject(error.response)
})
