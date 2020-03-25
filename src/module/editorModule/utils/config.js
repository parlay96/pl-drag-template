/**
 *  属性配置表
 */
// 页面宽度
export const pageWh = {
  width: 375, // 模板宽度
  height: 667 // 模板高度
}

// 画板组件的基础的样式（不要去改变它里面的属性）
export const defaultStyle = {
  position: 'absolute',
  top: 5,
  left: 5
}

// 容器里面是模板组件，不是画板组件的基本样式（这个样式意思就是去改变原本的容器样式）（不要去改变它里面的属性）
export const moduleContainer = {
  allowed: false,
  titleBarName: '标题栏',
  pointList: [], // 控制组件拖动的方向
  // 容器画板的默认样式
  commonStyle: {
    width: pageWh.width,
    height: 'auto',
    position: 'relative',
    backgroundColor: '#fff'
  }
}

// 元素配置信息字段
export const elementConfig = {
  animations: [], // 动画
  events: [], // 事件
  commonStyle: {}, // 样式
  propsValue: {} // 组件data默认属性参数
}

// 页面配置信息字段
export const projectConfig = {
  name: '可视化页面编辑器',
  scale: 1, // 页面的视图百分比，放大缩小
  // 页面初始样式
  commonStyle: {
    backgroundColor: '#f4f4f4'
  },
  author: 'pl',
  pageName: '页面名称',
  config: {}, // 页面信息配置
  width: pageWh.width,
  height: pageWh.height,
  elements: [] // 页面容器集合
}
