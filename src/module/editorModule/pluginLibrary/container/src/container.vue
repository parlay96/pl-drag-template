<template>
  <!--页面模板的容器层-->
  <section class="pl-container"
           :style="convertCommonStyle(containerItem.containerStyle)"
           :data-uuid="containerItem.uuid">
    <!--每个容器里面的顶部需要一个放在这里，索引盒子就是它节点的索引-->
    <div class="g_middlePlaceholder"
         :data-container-index="containerIndex"
         v-show="middlePlaceholder">放在这里</div>
    <!--可拖动的容器层-->
    <div class="module-component-wrapper"
         :class="[
           // 如果我当前点击的容器子节点类型为模块，module: true,
           // 那么父容器就得被设置为选中状态。因为我容器里面的不是画板元素
           {moduleActive: parentContainerInfo.uuid === containerItem.uuid},
           // 容器被选中的样式
           {editStatus: containerItem.uuid === activeElementUUID},
           // 容器的子节点被获取焦点，然后容器本身的样式改变（边框线变色）
           {childHover: getFindIndex !== -1}
         ]"
         :ref="'container' + containerIndex"
         @mouseover="containerMouseover('container' + containerIndex, containerIndex)"
         @mouseout="containerMouseouts"
         @click="handleTopWrapperClick(containerItem)">

      <!--他就是用来判断拖拽结束后，是否可以放置节点在容器上,非常重要，middlePlaceholder是左边组件区域拖动时就为true-->
      <!--画板容器的蒙层,这个蒙层非常重要，我拖拽时，它就是容器最顶层的元素，它作用就是让我获取到当前拖拽元素，落在我容器上的结束点（xy坐标）-->
      <!--然后我会在拖拽结束的事件上进行判断，类上面是否存在allowed类名，存在代表当前容器可以插入节点，不存在代表当前容器不能插入节点-->
      <!--因为module_editor覆盖了整个容器，所以要把titles的高度传递过去，不然获取坐标包含了标题高度-->
      <!--具体请看: 全局搜索drops事件方法-->
      <div class="module_editor"
           v-show="middlePlaceholder"
           :data-container-index="containerIndex"
           :data-title-height="containerItem.showTitle && containerItem.titleStyle ? containerItem.titleStyle.height : 0"
           :class="{ allowed: containerItem.allowed }"/>
      <!--容器标题层-->
      <div class="titles"
           v-if="containerItem.showTitle"
           :style="convertCommonStyle(containerItem.titleStyle)">
        {{ titleBarName }}
      </div>
      <!--容器组件画板层-->
      <div class="module_bgContent_wrapper" :style="convertCommonStyle(containerItem.commonStyle)">
        <!--空数据布局-->
        <div v-if="!containerItem.childNode.length" class="emptyModule">
          <div class="emptyModuleText">自由容器可添加文本、图片、按钮模块</div>
        </div>
        <!--存在节点时，渲染组件-->
        <div class="packModulesContainer" v-if="containerItem.childNode.length">
          <slot/>
        </div>
        <!--拖动容器盒子的小圆点-->
        <div class="edit-shape-point"
             v-for="item in (containerItem.uuid === activeElementUUID ? containerItem.pointList || [] : [])"
             :key="item"
             @mousedown="handleMouseDownOnPoint(item)"
             :style="getPointStyle(item)"/>
      </div>
    </div>
  </section>
</template>

<script>
  import { getCommonStyle } from '../../../utils/methods'
  import { convertPointStyle } from '../../../utils/drawing'
  import { createNamespacedHelpers } from 'vuex'
  const { mapMutations, mapState } = createNamespacedHelpers('editorModule')
  // 容器模板
  export default {
    name: 'PlContainer',
    computed: {
      ...mapState({
        activeElementUUID: state => state.activeElementUUID,
        hoverChildUUID: state => state.hoverChildUUID,
        middlePlaceholder: state => state.middlePlaceholder,
        parentContainerInfo: state => state.parentContainerInfo
      }),
      getFindIndex () {
        return this.containerItem.childNode.findIndex(item => item.uuid === this.hoverChildUUID)
      }
    },
    props: {
      containerIndex: {
        require: true,
        type: Number,
        default: 0
      },
      titleBarName: {type: String, default: ''},
      commonStyle: {
        require: true,
        type: Object,
        default: () => { return {} }
      },
      containerItem: {
        type: Object,
        default: () => { return {} }
      }
    },
    methods: {
      ...mapMutations([
        'setActiveElementUUID',
        'setParentInfo',
        'setContainerIndex'
      ]),
      // 获取节点样式
      convertCommonStyle (data) {
        return getCommonStyle(data)
      },
      // 获取point计算后样式
      getPointStyle (point) {
        return convertPointStyle(point, this.commonStyle)
      },
      // 点击事件，点击后设置当前元素为选中元素
      handleTopWrapperClick (containerItem) {
        // 抛出事件让父组件设置当前元素选中状态
        this.setActiveElementUUID(containerItem.uuid)
        // 点击其他容器，就需要去清空之前容器的信息对象
        this.setParentInfo()
      },
      // 鼠标点击可以的按钮resize事件
      handleMouseDownOnPoint (point) {
        let downEvent = event
        // 抛出事件让父组件设置当前元素选中状态
        downEvent.stopPropagation()
        downEvent.preventDefault() // Let's stop this event.
        // 判断我的容器最小高度
        let WrapperMinHeight = parseFloat(this.containerItem.commonStyle.minHeight) || 0

        const pos = {...this.commonStyle}
        let height = pos.height
        let width = pos.width
        let top = pos.top
        let left = pos.left
        let startX = downEvent.clientX
        let startY = downEvent.clientY
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
          pos.height = newHeight > 0 ? newHeight : 0
          pos.width = newWidth > 0 ? newWidth : 0
          pos.left = +left + (hasL ? disX : 0)
          pos.top = +top + (hasT ? disY : 0)
          // 必须大于我容器的最小高度
          if (pos.height > WrapperMinHeight) this.$emit('resize', pos)
        }
        let up = () => {
          this.$emit('resize')
          document.removeEventListener('mousemove', move)
          document.removeEventListener('mouseup', up)
        }
        document.addEventListener('mousemove', move)
        document.addEventListener('mouseup', up)
      },
      // 容器获取焦点事件
      containerMouseover (dom, containerIndex) {
        // 设置当前获取焦点的容器索引值
        this.setContainerIndex(containerIndex)
        // 获取当前容器距离页面的距离(Element.getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置。)
        let object = this.$refs[dom]
        let rectObject = object.getBoundingClientRect()
        this.$emit('containerMouseover', rectObject)
      },
      // 容器失去焦点事件
      containerMouseouts (e) {
        // 如果容器失去焦点的元素是在左上角的按钮元素上，就不需要去删除容器的索引值，以及隐藏按钮区域
        if (e.toElement && e.toElement.classList.contains('sm-tool-btn')) return
        // 否则隐藏按钮区域，清空当前容器的索引值
        this.setContainerIndex(null)
        this.$emit('containerMouseout')
      }
    }
  }
</script>
