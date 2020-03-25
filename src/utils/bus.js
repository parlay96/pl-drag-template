 // 非父子组件通信的公共汽车
import Bus from 'vue'
export default {
  install (Vue) {
    Vue.prototype.$bus = new Bus()
  }
}
