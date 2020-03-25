/**
 * 组件库入口
 * */
// 基础组件
import plEditDiv from './editDiv' // 必须放第一个位置引入 因为下面的组件有用到它
import plText from './text'
import plButton from './Button'
import plContainer from './container'
import cubeNav from './cubeNav'
import carousel from './carousel'
// 所有组件列表
const components = [
  plEditDiv,
  plText,
  plButton,
  plContainer,
  cubeNav,
  carousel
]

let plRegisterComponentsObject = {}
let componentsName = []

components.forEach(item => {
  plRegisterComponentsObject[item.name] = item
  // 导出当前组件的组件名
  if (item.name && typeof item.name === 'string') {
    componentsName.push(item.name.toLowerCase())
  }
})

// 定义 install 方法，接收 Vue 作为参数
const install = function (Vue) {
  // 判断是否安装，安装过就不继续往下执行
  if (install.installed) return
  install.installed = true
  // 遍历注册所有组件
  components.map(component => Vue.component(component.name, component))
}

export {
  componentsName,
  plEditDiv,
  cubeNav,
  plButton,
  carousel,
  plText,
  plContainer,
  plRegisterComponentsObject
}

export default {
  install
}
