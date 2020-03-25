import router from './config/router'
import store from './vuex'
router.beforeEach((to, from, next) => {
  store.state.loadingCount = 0 // 如果跳了页面，就把之前页面的请求次数清除为0
  // 判断权限
  let token = store.state.token.token
  if (token) {
    // 如果我当前是有权限的，手动输入地址到登录页面或者点击浏览器回退到登录页面，
    //     那么不好意思，你就不能去登录页面（你就去跳转前的路径）
    next()
  } else {
    next()
  }
})
