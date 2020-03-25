<template>
  <!--组件的最外层, borderNone: childItem.module 如果我当前是模块，不是画板元素，那么组件外层获取焦点，选中都不要边框线-->
  <div class="commonModule"
       :data-uuid="childItem.uuid"
       draggable="false"
       :class="{editStatus: childItem.uuid === activeElementUUID, borderNone: childItem.module}"
       :style="filterCommonStyle(childItem.commonStyle, 'commonModule')"
       @mouseover="childMouseover(childItem, $event)"
       @mouseout="setHoverChildUUID()"
       @mousedown="handleMouseDownOnElement(childItem, $event)"
       @click.stop="handleTopWrapperClick(childItem)">
    <!--容器内的模板组件-->
    <component :is="childItem.elName"
               :class="getClassList(childItem.options)"
               :style="filterCommonStyle(childItem.commonStyle)"
               v-model="childItem.value"
               v-bind="{ childItem: childItem }"
               @plTextMouseDown="plTextMouseDowns"/>
    <!--组件拖动小圆点-->
    <div class="edit-shape-point"
         v-for="item in (childItem.uuid === activeElementUUID ? childItem.pointList || [] : [])"
         :key="item"
         :style="getPointStyle(item)"
         @mousedown="handleMouseDownOnPoint(item, $event)"/>
    <!--容器里面的画板元素。功能按钮区域, 非画板组件不显示，画板组件才显示-->
    <div class="tool-wrapper" v-if="!childItem.module">
      <tool-btn :icon-data="btnData" @toolBtnChange="toolBtnChange"/>
    </div>
  </div>
</template>

<script>
  import {Component, Vue, Prop} from 'vue-property-decorator'
  import { deepClone, getCommonStyle } from '../utils/methods'
  import { convertPointStyle, getClassList } from '../utils/drawing'
  import {namespace} from 'vuex-class'
  import {plRegisterComponentsObject} from '../pluginLibrary'
  import toolBtn from '../components/tool-btn'
  const editorModule = namespace('editorModule')
  @Component({methods: {getCommonStyle, getClassList}, components: { ...plRegisterComponentsObject, toolBtn }})
  // 子节点模板
  export default class childNodeComponent extends Vue {
    @editorModule.State('activeElementUUID') activeElementUUID
    @editorModule.Mutation('setActiveElementUUID') setActiveElementUUID
    @editorModule.Mutation('setHoverChildUUID') setHoverChildUUID
    @editorModule.Getter('getParentInfo') getParentInfo
    @editorModule.Mutation('setParentInfo') setParentInfo
    @editorModule.Mutation('setContainerIndex') setContainerIndex
    @editorModule.Action('reqDeleteNodeElement') reqDeleteNodeElement
    @Prop({type: Object, default: () => { return {} }}) commonStyle
    @Prop({type: Object, default: () => { return {} }}) childItem
    // 子节点功能按钮区域
    btnData = [
      {name: '删除', icon: 'iconshanchu'}, // name属性很重要代表当前的按钮操作
      {name: '编辑', icon: 'iconbianji-copy-copy'}
    ]

    // 过滤组件样式
    filterCommonStyle (style, type) {
      const objD = ['position', 'left', 'top', 'zIndex']
      const commonModuleStyle = {}
      const cs = deepClone(getCommonStyle(style))
      objD.forEach(item => {
        for (let i in cs) if (item === i) commonModuleStyle[item] = cs[i]
        delete cs[item]
      })
      // 如果是组件外层，就只需要objD数组里面的样式
      if (type === 'commonModule') {
        return commonModuleStyle
      } else {
        // 其他的就是组件本身的样式
        return cs
      }
    }
    // 点击事件，点击后设置当前元素为选中元素
    handleTopWrapperClick (childItem) {
      // 设置当前选中的组件id
      this.setActiveElementUUID(childItem.uuid)
      // 因为模块不能拖动。模块本身就是当一个容器在使用，所以需要做下面的事情
      // 如果我当前点击的是个模块，不是个画板，那么就需要去吧父节点容器给选中，就是得把父节点加上个边框线
      // 如果我点击的是模块。那么就需要把父容器的信息给存起来，放到vuex中
      if (childItem.module) {
        this.setParentInfo(this.getParentInfo(childItem.uuid))
        // console.log(this.getParentInfo(childItem.uuid))
      } else {
        // 点击的不是模块，就需要去清空当前父容器的信息对象
        this.setParentInfo()
      }
    }
    // 获取point计算后样式
    getPointStyle (point) {
      return convertPointStyle(point, this.commonStyle)
    }
    // 鼠标选中元素拖拽事件
    handleMouseDownOnElement (childItem, e) {
      // 如果当前是模块则不让拖动 || 如果元素节点当前为编辑状态，则不让拖动
      if (childItem.module || childItem.contenteditable) {
        return true
      } else {
        // 拖拽的不是模块，就需要去清空当前父容器的信息对象
        this.setParentInfo()
      }

      this.setActiveElementUUID(childItem.uuid)
      // 当前选中容器被拖动执行下面
      const pos = {...this.commonStyle}
      let startY = e.clientY
      let startX = e.clientX
      let startTop = pos.top
      let startLeft = pos.left
      let firstTime = ''
      let lastTime = ''
      firstTime = new Date().getTime()
      let move = moveEvent => {
        // !#zh 移动的时候，不需要向后代元素传递事件，只需要单纯的移动就OK
        moveEvent.stopPropagation()
        moveEvent.preventDefault()

        let currX = moveEvent.clientX
        let currY = moveEvent.clientY
        pos.top = currY - startY + startTop
        pos.left = currX - startX + startLeft
        this.$emit('resize', pos)
      }
      let up = () => {
        lastTime = new Date().getTime()
        if ((lastTime - firstTime) > 200) {
          this.$emit('resize')
        }
        document.removeEventListener('mousemove', move, true)
        document.removeEventListener('mouseup', up, true)
      }
      document.addEventListener('mousemove', move, true)
      document.addEventListener('mouseup', up, true)
      return true
    }
    // 该事件是因为文本框的拖动圆点是文本框自带的（plText组件emit抛出了的事件），不是pointList
    plTextMouseDowns (point) {
      this.handleMouseDownOnPoint(point, event, 'text')
    }
    // 鼠标点击可以的按钮resize事件
    handleMouseDownOnPoint (point, event, type) {
      let downEvent = event
      // 抛出事件让父组件设置当前元素选中状态
      downEvent.stopPropagation()
      downEvent.preventDefault() // Let's stop this event.
      const pos = {...this.commonStyle}
      let height = pos.height
      let width = pos.width
      let top = pos.top
      let left = pos.left
      let startX = downEvent.clientX
      let startY = downEvent.clientY
      // 当前模块的最小宽度值
      let minWidth = 0
      if (pos.minWidth) {
        minWidth = pos.minWidth
      }
      // 当前模块的最小高度值
      let minHeight = 0
      if (pos.minHeight) {
        minHeight = pos.minHeight
      }
      let move = moveEvent => {
        let currX = moveEvent.clientX
        let currY = moveEvent.clientY
        let disY = currY - startY
        let disX = currX - startX
        let hasT = /t/.test(point)
        let hasB = /b/.test(point)
        let hasL = /l/.test(point)
        let hasR = /r/.test(point)
        let newHeight = +height + (hasT ? -disY : hasB ? disY : 0)
        let newWidth = +width + (hasL ? -disX : hasR ? disX : 0)
        pos.width = newWidth > 0 ? newWidth : 0
        pos.left = +left + (hasL ? disX : 0)
        pos.top = +top + (hasT ? disY : 0)
        // 拖动类型为文本则不可改变高度
        if (type !== 'text') {
          pos.height = newHeight > 0 ? newHeight : 0
        }
        // 如果宽度小于最小宽度就直接返回
        if (pos.width < minWidth) return
        // 如果高度小于最小高度就直接返回
        if (pos.height < minHeight) return
        // 行高需要随着高度变化
        if (this.childItem.options && this.childItem.options.lineHeightChange && type !== 'text') {
          pos.lineHeight = pos.height
        }
        this.$emit('resize', pos)
      }
      let up = () => {
        this.$emit('resize')
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
      }
      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    }
    // 模块按钮点击区域
    toolBtnChange (title) {
      // console.log(title)
      if (title === '删除') {
        this.reqDeleteNodeElement(this.childItem.uuid)
      }
    }
    // 子节点的获取焦点事件
    childMouseover (childItem, event) {
      // 当前被鼠标获取焦点的子节点的ID
      this.setHoverChildUUID(childItem.uuid)
      // 下面非常重要，如果是画板组件，那么就隐藏容器右上角模块的按钮区域
      if (!childItem.module) {
        // 阻止事件冒泡
        if (event) {
          event.stopPropagation()
          event.preventDefault()
        } else {
          window.event.returnValue = false
          window.event.cancelBubble = true
        }
      }
    }
  }
</script>
