import router from './router'
import store from './store'
router.beforeEach((to, from, next) => {
  // 判断权限
  let token = store.state.token.token
  if (token) {
    // 如果我当前是有权限的，手动输入地址到登录页面或者点击浏览器回退到登录页面，
    //     那么不好意思，你就不能去登录页面（你就去跳转前的路径）
    if (to.path === '/login') {
      next(from.path)
      // 如果不是登录页面，那么就把当前路由信息进行保存
    } else {
      next()
    }
  } else {
    console.log('无权限')
    if (to.path === '/login') { // 如果是登录页面路径，就直接next()
      next()
    } else { // 不然就跳转到登录
      next('/login')
    }
  }
})
