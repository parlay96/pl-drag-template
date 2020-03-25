/*
 *   注意注意注意: pluginLibrary里面组件的name值必须写，然后必须写下面的elName组件名
 *   1. elName: 'pl-text', // 非常重要请正确写上对应的vue组件的组件名，name值 如export default {name: 'PlButton'} 那么elName就是pl-button
 *   2. 除了容器的对象plContainer属性，（注意：看容器的属性请看下面的容器基本结构）其他配置表属性的介绍如下
 *    title： 组件提示文字（左边组件按钮区域用到了）
 *    icon： 组件图标（左边组件按钮区域用到了，使用的是 Iconfont-阿里巴巴矢量图标库）
 *    以下全是组件本身的属性，不是左边组件按钮区域列表的属性
 *    elName： 组件名
 *    pointList： 控制组件拖动的方向(拖动的小圆点)  pointList: ['lt' 左上, 'rt' 右上, 'lb' 左下, 'rb' 右下, 'l' 左, 'r' 右, 't' 上, 'b' 下],
 *     // ['lt', 'rt', 'lb', 'rb', 'l', 'r', 't', 'b' ]
 *    value: '' // 输入框的值，主要用在这个画板元素上的输入框类型组件上
 *    contenteditable: 组件输入状态是否可以被拖动
 *    placeholder: 输入框类型的组件，空文本提示文字
 *    commonStyle：初始化的样式，就是css不多介绍
 *    options：{ // 组件配置项
 *        classList: [], 当前组件的类集合
          lineHeightChange: true // 表示行高需要随着拖动的高度变化（只有可以拖动的元素有效）
 *    }
 *    module: boolean 为true代表当前组件不是个画板元素，而是作为一个模块的身份。（但是它依然存放在容器中） 什么是非画板元素，就是不能再自由容器中拖动和自由组合，非画板元素是模块组件
 *    containerOptions: {} 如果我配置了module为true,代表当前是个模块，模块身份可以去配置容器对象的属性
 *    propsValue: {} // 里面包含了组件所有的data对象属性，它不需要再基本结构中配置，他会在生成组件的时候会放到该配置中来
 */
import {pageWh, defaultStyle, moduleContainer} from './config'

// 容器的基本结构
export const plContainer = {
  elName: 'pl-container',
  title: '自由容器',
  icon: 'iconfont iconrongqi',
  pointList: ['b'], // 模块拖动的方向有哪些
  // 容器最外层盒子的样式
  containerStyle: { // 容器大盒子的样式
    marginBottom: 10
  },
  allowed: true, // 代表我当前容器是个画板，拖动画板元素可以放到容器上面
  showTitle: true, // 是否显示头部
  // 容器头部的样式
  titleStyle: {
    height: 50,
    lineHeight: 50
  },
  titleBarName: '标题栏',
  // 容器画板的默认样式
  commonStyle: {
    width: pageWh.width,
    height: 250,
    position: 'relative',
    minHeight: 50, // 容器里面的画板最小高度值
    backgroundColor: '#fff'
  },
  childNode: [] // 容器子节点的集装箱
}

// 基础组件
const BasicComponents = [
  {
    title: '基础组件',
    components: [
      plContainer,
      {
        elName: 'pl-text',
        title: '文本',
        icon: 'iconfont iconwenbenyu',
        pointList: [], // 控制组件拖动的方向
        contenteditable: false,
        placeholder: '点击输入内容',
        commonStyle: {
          ...defaultStyle,
          padding: 8,
          fontSize: 15,
          lineHeight: 17,
          height: 'auto',
          textAlign: 'left',
          minWidth: 35,
          width: 160
        }
      },
      {
        elName: 'pl-button',
        title: '按钮',
        icon: 'iconfont iconanniu',
        pointList: ['lt', 'rt', 'lb', 'rb', 'l', 'r', 't', 'b'], // 控制组件拖动的方向
        contenteditable: false,
        options: {
          classList: [],
          lineHeightChange: true // 表示行高需要随着拖动的高度变化
        },
        commonStyle: {
          ...defaultStyle,
          fontSize: 15,
          lineHeight: 36,
          height: 36,
          textAlign: 'center',
          minWidth: 35,
          minHeight: 36,
          width: 80
        }
      },
      {
        elName: 'cube-nav',
        title: '魔方导航',
        icon: 'iconfont iconfenlei',
        module: true,
        containerOptions: {
          ...moduleContainer,
          titleBarName: '魔方导航模块'
        },
        options: {
          classList: []
        }
      },
      {
        elName: 'carousel',
        title: '多图文轮播',
        icon: 'iconfont iconlunbotu',
        module: true,
        containerOptions: {
          ...moduleContainer,
          titleBarName: '多图文轮播'
        },
        options: {
          classList: []
        }
      }
    ]
  }
]

const components = [...BasicComponents]

// 遍历判断找出画板元素的组件
// 在拖拽元素到画板的时候，会判断当前拖动的组件是否在这里面存在，存在才可以添加组件到画板容器
// 必须是画板组件
export const drawingComponent = components.map(item => item.components.map(con => {
  if (!con.module && con.elName !== 'pl-container') return con.elName
}))[0].filter(item => item)

export default components
