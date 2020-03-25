import {cloneDeep, merge, camelCase} from 'lodash'
import {plRegisterComponentsObject} from '../pluginLibrary'
import { elementConfig } from './config'

/**
 * 生成uuid方法
 * @returns {string}
 */
export const createUUID = function () {
  var d = new Date().getTime()
  if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now() // use high-precision timer if available
  }
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
  return uuid
}

/**
 * 深拷贝
 * @param {*} obj 拷贝对象(object or array)
 * @param {*} cache 缓存数组
 */
export const deepClone = function (obj, cache = []) {
  // typeof [] => 'object'
  // typeof {} => 'object'
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  // 如果传入的对象与缓存的相等, 则递归结束, 这样防止循环
  /**
   * 类似下面这种
   * var a = {b:1}
   * a.c = a
   * 资料: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
   */
  const hit = cache.filter(c => c.original === obj)[0]
  if (hit) {
    return hit.copy
  }

  const copy = Array.isArray(obj) ? [] : {}
  // 将copy首先放入cache, 因为我们需要在递归deepCopy的时候引用它
  cache.push({
    original: obj,
    copy
  })
  Object.keys(obj).forEach(key => {
    copy[key] = deepClone(obj[key], cache)
  })

  return copy
}

// 组装节点的数据
export const getElementConfig = function (element) {
  // 当前组件的基本信息数据
  let elementData = cloneDeep(element)
  // 获取初始化字段属性数据
  let elementConfigData = cloneDeep(elementConfig)
  let config = {
    uuid: createUUID(), // 必需品
    ...elementConfigData,
    ...elementData,
    propsValue: deepClone(elementData.needProps || {})
  }
  // 样式
  config.commonStyle = merge(config.commonStyle, elementData.commonStyle)
  delete config.needProps
  return config
}

/**
 * 获取元素样式
 * @param styleObj
 * @param scalingRatio 缩放比例
 */
export const getCommonStyle = function (styleObj, scalingRatio = 1) {
  let needUnitStr = ['width', 'height', 'lineHeight', 'padding', 'top', 'left', 'paddingTop', 'paddingLeft', 'paddingRight', 'paddingBottom', 'marginTop', 'marginLeft', 'marginRight', 'marginBottom', 'borderWidth', 'fontSize', 'borderRadius', 'letterSpacing']
  let style = {}
  if (!styleObj) return {}
  for (let key in styleObj) {
    if (needUnitStr.includes(key)) {
      style[key] = typeof styleObj[key] === 'string' ? styleObj[key] : (styleObj[key] * scalingRatio) + 'px'
    } else {
      style[key] = styleObj[key]
    }
  }
  style.transform = `rotate(${style.rotate}deg)`
  style.backgroundImage = style.backgroundImage ? `url(${style.backgroundImage})` : ''
  return style
}

/**
 * 根据elname获取组件默认props/data数据
 * @param elName
 */
export const getComponentProps = (elName) => {
  let elComponentData
  for (let key in plRegisterComponentsObject) {
    if (key.toLowerCase() === camelCase(elName).toLowerCase()) {
      elComponentData = plRegisterComponentsObject[key]
      break
    }
  }
  if (!elComponentData) return {}
  let props = {}
  // 获取props
  // for (let key in elComponentData.props) {
  //   props[key] = [Object, Array].includes(elComponentData.props[key].type) ? elComponentData.props[key].default() : elComponentData.props[key].default
  // }
  // 获取data
  const datas = elComponentData.data ? elComponentData.data() : {}
  for (let key in datas) {
    props[key] = datas[key]
  }
  return props
}
