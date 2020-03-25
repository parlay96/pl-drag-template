// 为组件提供 install 方法，供组件对外按需引入
import Component from './src/cubeNav'
Component.install = Vue => {
  Vue.component(Component.name, Component)
}
export default Component
