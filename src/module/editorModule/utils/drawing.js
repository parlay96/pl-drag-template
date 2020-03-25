// 获取point计算后样式
import {deepClone, getComponentProps, getElementConfig} from './methods'
import {plContainer} from './ele-config'
import {componentsName} from '../pluginLibrary'
import { moduleContainer } from '../utils/config'
import {camelCase} from 'lodash'
import {Message} from 'element-ui'

const DK = {t: 'n', b: 's', l: 'w', r: 'e'} // 上下左右 对应的 东南西北
export const convertPointStyle = (point, defaultStyle, directionKey = DK) => {
  const pos = defaultStyle
  const height = pos.height
  const width = pos.width
  let hasT = /t/.test(point)
  let hasB = /b/.test(point)
  let hasL = /l/.test(point)
  let hasR = /r/.test(point)
  let newLeft = 0
  let newTop = 0
  if (point.length === 2) {
    newLeft = hasL ? 0 : width
    newTop = hasT ? 0 : height
  } else {
    // !#zh 上下点，宽度固定在中间
    if (hasT || hasB) {
      newLeft = width / 2
      newTop = hasT ? 0 : height
    }
    // !#zh 左右点，高度固定在中间
    if (hasL || hasR) {
      newLeft = hasL ? 0 : width
      newTop = height / 2
    }
  }
  const style = {
    marginLeft: (hasL || hasR) ? '-5px' : 0,
    marginTop: (hasT || hasB) ? '-4px' : 0,
    left: `${newLeft}px`,
    top: `${newTop}px`,
    cursor: point.split('').reverse().map(m => directionKey[m]).join('') + '-resize'
  }
  return style
}

// 获取类数组
export const getClassList = (options) => {
  if (!options || !options.classList) return []
  return options.classList
}

// 判断是否为一个对象
export const judgeObject = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

// 判断是否为一个数组
export const judgeArray = (att) => {
  return Object.prototype.toString.call(att) === '[object Array]'
}

// 获取需要绘画的节点数据
export const getNodeElement = (nodeData, type) => {
  // 如果不存在该组件就直接返回
  if (!nodeData || !componentsName.includes(camelCase(nodeData.elName).toLowerCase())) {
    Message.error({message: '没有该模块!', type: 'warning', duration: 2000})
    return null
  }
  //  需要添加的节点元素对象
  let nodeElement
  // 获取当前组件的data数据
  let props = getComponentProps(nodeData.elName)
  // 获取需要添加的节点元素的数据结构
  nodeElement = deepClone(getElementConfig({...nodeData, needProps: props}))
  // 注意注意注意: 如果我进来的不是容器，那么就需要包装一层容器，在返回节点
  // type如果存在，代表我是往容器里面加节点不需要被容器包裹，就不需要执行if语句了
  if (nodeElement.elName !== 'pl-container' && type !== '我是往容器里面加节点不需要被容器包裹') {
    // 获取pl-container容器组件的data数据
    let props = getComponentProps('pl-container')
    // 获取容器的基本结构
    let containerNodeData = getElementConfig({...plContainer, needProps: props})

    // 什么是非画板元素，就是不能再自由容器中拖动和自由组合，非画板元素是模块组件
    // 下面if语句是做非画板元素的关键，意思就是非画板元素，它也属于自由容器中，但是它不能拖动
    // 如果当前组件是一个模块, 就需要执行下面的语句
    if (nodeElement.module) {
      // 如果是模块，那么就去看是否改变了容器的样式，没有改变默认给个改变容器的基本值
      let cops = judgeObject(nodeElement.containerOptions) ? nodeElement.containerOptions : moduleContainer
      // 合并容器的属性(很好理解就是去覆盖掉原来容器的属性，因为原来容器的属性是为了画板而生的，但是模块本身也是被容器包裹的，所以需要去覆盖容器的配置)
      let newContainer = {...containerNodeData, ...cops}
      // 删除当前需要添加的节点，里面的配置容器对象
      delete nodeElement.containerOptions
      // 然后再把需要添加的节点放入容器中
      newContainer.childNode.push(nodeElement)
      return deepClone(newContainer)
    }

    // 把需要添加的元素放入到容器节点中
    containerNodeData.childNode.push(nodeElement)
    // 导出容器
    return deepClone(containerNodeData)
  }
  // 返回当前组件
  return nodeElement
}

// 滚动条滚动动画
export const ScrollTop = (dom, number = 0, time) => {
  if (!time) {
    dom.scrollTop = number
    return number
  }
  const spacingTime = 20 // 设置循环的间隔时间  值越小消耗性能越高
  let spacingInex = time / spacingTime // 计算循环的次数
  let nowTop = dom.scrollTop // 获取当前滚动条位置
  let everTop = (number - nowTop) / spacingInex // 计算每次滑动的距离
  let scrollTimer = setInterval(() => {
    if (spacingInex > 0) {
      spacingInex--
      ScrollTop(dom, nowTop += everTop)
    } else {
      clearInterval(scrollTimer) // 清除计时器
    }
  }, spacingTime)
}

// 数组对象去重的方法, data需要去重的数组对象，key需要去重对象的字段对应key
export const ArrayRemoval = (data, key) => {
  //  方法1：利用对象访问属性的方法，判断对象中是否存在key
  let result = []
  let obj = {}
  let newData = deepClone(data)
  for (let i = 0; i < newData.length; i++) {
    if (!obj[newData[i][key]]) {
      result.push(newData[i])
      obj[newData[i][key]] = true
    }
  }
  return result
}

// 上移下移置顶置底
export const swapItems = (arr, index1, index2, direction) => {
  if (direction === 'up') { // 置顶
    arr.unshift(arr[index1])
    arr.splice(index1 + 1, 1)
    return arr
  }
  if (direction === 'down') { // 置底
    arr.push(arr[index1])
    arr.splice(index1, 1)
    return arr
  }
  arr[index1] = arr.splice(index2, 1, arr[index1])[0]
  return arr
}
