<template>
  <div class="editor-pane">
    <div class="editor-pane-inner" @click="handleClickCanvas">
      <div class="editorMain_content"
           @mouseout="editorMainContentMouseout"
           :style="{
             transform: 'scale('+projectData.scale+')',
             width: projectData.width + 'px',
             height: projectData.height + 'px'}">
        <!--页面外层的盒子，也是页面画板的入口-->
        <div class="page-preview-wrapper"
             ref="canvas-panel"
             id="canvas-panel"
             :style="getCommonStyle(projectData.commonStyle)">
          <!--头部-->
          <div class="editor-head">{{ projectData.pageName }}</div>
          <!--画板--> <!--页面模板的容器层 @dragover.prevent必须写 drop事件才能正常执行-->
          <!--注意在注意：下来的这个div包含的class类只能增加 不能减少，不能去改下面的类名，因为拖拽事件需要判断-->
          <div class="editor-wrapper"
               ref="editorWrapper"
               @dragover.prevent
               @dragenter="dragenter"
               @dragleave="dragleave"
               @dragover="dragovers"
               @drop="drops">
            <!--画板列表-->
            <div class="editor-wrapper-container" v-if="projectData.elements.length">
              <pl-container
                v-for="(item, index) in projectData.elements"
                :key="item.uuid"
                :container-index="index"
                :common-style="item.commonStyle"
                :title-bar-name="item.titleBarName"
                :container-item="item"
                @containerMouseover="containerMouseovers"
                @containerMouseout="containerMouseout"
                @resize="handleElementResize">
                <child-node-component
                  v-for="childItem in item.childNode"
                  :key="childItem.uuid"
                  :common-style="childItem.commonStyle"
                  :child-item="childItem"
                  @resize="handleElementResize"/>
              </pl-container>
              <!--在每个容器（pl-container）里面的顶部也有一个这样的节点-->
              <!--画板列表底部需要放个“提示框”索引值就是数组的length，因为需要在最后一个节点底部放上节点-->
              <div class="g_middlePlaceholder"
                   :data-container-index="projectData.elements.length"
                   v-show="middlePlaceholder">放在这里</div>
            </div>
            <!--无画板组件-->
            <div class="emptyPage" v-else>
              <div class="emptyPageBg"/>
              <p class="emptyPageTip">点击模块，马上设计您的专属小程序!</p>
              <button class="pl_button addModuleBtn">
                <span class="jz_button_content">添加模块</span>
              </button>
            </div>
          </div>
          <!--导航-->
          <div class="editor-nav">
            <a v-for="(item, index) in editorNav"
               class="nav-item"
               :style="{ width: (100 / editorNav.length) + '%', color: index === 0 ? 'rgb(255, 114, 20)' : ''}"
               :key="index">
              <span :class="item.icon" class="nav-icon-wrap"/>
              <span class="nav-text">{{ item.name }}</span>
            </a>
          </div>
        </div>
        <!--容器功能按钮区域-->
        <div class="containerBtnArea"
             v-show="containerBtnAreaControl"
             :style="{ top: containerBtnAreaTop + 'px' }">
          <tool-btn :icon-data="containerBtnData"
                    :tool-style="{width: '25px', height: '25px'}"
                    @toolBtnChange="containerToolBtnChange"
                    line-type="horizontalLine"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {Component, Vue, Watch} from 'vue-property-decorator'
  import {plContainer} from '../pluginLibrary'
  import childNodeComponent from '../components/childNodeComponent'
  import { drawingComponent } from '../utils/ele-config'
  import toolBtn from '../components/tool-btn'
  import { getCommonStyle } from '../utils/methods'
  import { ScrollTop, ArrayRemoval, swapItems } from '../utils/drawing'
  import {namespace} from 'vuex-class'
  import {Message} from 'element-ui'
  const editorModule = namespace('editorModule')
  @Component({components: {plContainer, childNodeComponent, toolBtn}, methods: {getCommonStyle}})
  // editor画板入口
  export default class editorPan extends Vue {
    @editorModule.State('projectData') projectData
    @editorModule.State('activeContainerIndex') activeContainerIndex
    @editorModule.State('activeElementUUID') activeElementUUID
    @editorModule.State('middlePlaceholder') middlePlaceholder
    @editorModule.Getter('activeElementIndex') activeElementIndex
    @editorModule.Mutation('setActiveElementUUID') setActiveElementUUID
    @editorModule.Mutation('setMiddlePlaceholder') setMiddlePlaceholder
    @editorModule.Mutation('addDesignatedLocationElement') addDesignatedLocationElement
    @editorModule.Mutation('addDropNodeElement') addDropNodeElement
    @editorModule.Mutation('setParentInfo') setParentInfo
    @editorModule.Mutation('deleteNodeElement') deleteNodeElement
    @editorModule.Mutation('setContainerIndex') setContainerIndex
    containerBtnAreaTop = 0 // 按钮区域坐标位置
    containerBtnAreaControl = false // 控制容器按钮区域是否显示
    // 容器按钮区域
    containerBtnData = []
    // 导航区域
    editorNav = [
      {name: '首页', icon: 'iconfont iconshouyex'},
      {name: '购物车', icon: 'iconfont icongouwuchekong'},
      {name: '我的', icon: 'iconfont iconwode'}
    ]

    mounted () {
      // 这个事件是左边组件区域的点击事件，属于非父子组件通信
      this.$bus.$on('editorScroll', () => {
        // 滚动到底部
         this.$nextTick(() => {
           // console.log(this.$refs.editorWrapper)
           if (this.$refs.editorWrapper) {
             ScrollTop(this.$refs.editorWrapper, this.$refs.editorWrapper.scrollHeight, 500)
           }
         })
      })
    }

    // 移动改变元素大小定位
    handleElementResize (pos) {
      // 获取当前选中的索引值
      const indexData = this.activeElementIndex(this.activeElementUUID)
      // console.log(indexData)
      if (!pos) return
      // 如果length长度为1，代表拖动的事容器，如果length长度为2，代表拖动的事容器里面的节点
      if (indexData.length === 1) {
        this.projectData.elements[indexData[0]].commonStyle = {...pos}
      } else if (indexData.length === 2) {
        this.projectData.elements[indexData[0]].childNode[indexData[1]].commonStyle = {...pos}
      }
    }

    // 点击模板的中心，空余的地方就取消当前选中
    handleClickCanvas (e) {
      // console.log(e.target.classList)
      if (
        e.target.classList.contains('editor-pane-inner') ||
        e.target.classList.contains('editor-wrapper-container') ||
        e.target.classList.contains('editor-wrapper')
      ) {
        // 清除当前选中的UUid
        this.setActiveElementUUID('')
        // 点击模板的中心，空余的地方，就需要去清空当前父容器的信息对象
        this.setParentInfo()
      }
    }

    // 拖拽组件区域元素的事件drop  被拖拽的元素在目标元素上同时鼠标放开触发的事件，此事件作用在目标元素上（具体请看 html5 DataTransfer对象）
    drops (event) {
      // 获取dragstart事件传递的参数
      let data = JSON.parse(event.dataTransfer.getData('text'))
      // 清除dragstart事件传递的参数
      event.dataTransfer.clearData()
      // 没有组件名直接返回
      if (!data || !data.elName) return
      /*
       * 拖拽添加进去组件到画板（添加方式一共3种）
       * 1.元素节点是空布局的时候你只要拖拽结束点，属于画板区域就可以释放添加
       * 2.元素结束点是在“放在这里”的盒子上面，可以添加
       * 3.元素结束点是在容器上，且容器是画板的情况下（注: 因为不是画板模块本身也是由容器包裹着，并非可以编辑），可以添加
       *
       * 不可添加：不能再非自由模块的容器上添加进去
       */
      // 1. 如果结束位置的元素节点是空布局的时候
      if (this.projectData.elements.length === 0) {
        // 添加进节点
        this.addDesignatedLocationElement({
          index: 0, // 模板无节点的时候就直接索引0
          nodeData: data
        })
      // 2. 如果结束点是“放在这里”的这个盒子
      } else if (event.target.classList.contains('g_middlePlaceholder')) {
        // 添加进节点
        this.addDesignatedLocationElement({
          index: event.target.dataset['containerIndex'], // 获取节点的索引
          nodeData: data
        })
      // 3.元素结束点是在自由容器上，且自由容器可以编辑的情况下（注: 因为有些模块外层确实有自由容器但是，并非可以编辑），可以添加
      // 与上面不同在于，这里是往容器里面添加节点
      } else if (event.target.classList.contains('allowed')) {
        // 判断容器是否可以放置当前拖拽的元素
        if (drawingComponent.includes(data.elName)) {
          // 获取当前的标题栏的高度
          let titleHeight = event.target.dataset['titleHeight']
          // 落地点的坐标
          let X = event.layerX
          let Y = event.layerY
          // 如果我头部高度存在，那么就需要判断
          if (titleHeight) {
            let th = parseFloat(titleHeight)
            // 如果我头部高度大于落地的坐标Y轴（不属于我容器），那么我就得把节点的坐标值改成在容器的左上角
            if (Y < th) {
              // 把坐标点赋值给元素的top, left
              data.commonStyle.top = 5
              data.commonStyle.left = 5
            } else {
              // 不大于我的头部那我就需要把坐标点减去头部的高度，这样才能得到一个标准的坐标
              data.commonStyle.top = Y - th
              data.commonStyle.left = X
            }
          } else {
            // 把坐标点赋值给元素的top, left
            data.commonStyle.top = Y
            data.commonStyle.left = X
          }
          // 添加进节点
          this.addDropNodeElement({
            index: event.target.dataset['containerIndex'], // 获取容器的索引
            nodeData: data
          })
        } else {
          Message.error({message: '该模块不可以添加在容器中', type: 'warning', duration: 2000})
        }
      }
    }

    // 当拖曳元素进入目标元素的时候触发的事件，此事件作用在目标元素上
    dragenter (event) {
      // console.log(event, event.target.classList)
      // 拖动到容器的“放到这里（它是个提示）”盒子，就给盒子加上焦点样式
      if (event.target.classList.contains('g_middlePlaceholder')) {
        event.target.classList.add('gm_active')
      }
    }

   // 当拖动的元素或文本选择离开有效的放置目标时将触发该事件。此事件作用在目标元素上（具体请看 html5 DataTransfer对象）
    dragleave (event) {
      // 离开目标容器的“放到这里（它是个提示）”盒子，就给盒子移除焦点样式
      if (event.target.classList.contains('g_middlePlaceholder')) {
        event.target.classList.remove('gm_active')
      }
    }

    // 拖拽元素在目标元素上移动的时候触发的事件，此事件作用在目标元素上（主要用于拖动元素过程中，是否可以被放置节点。从而改变鼠标拖动操作效果）
    dragovers (event) {
      // 1. 如果拖动的元素可以放在当前元素上，那么图标效果是（一个项目可能被移动到新位置）
      if (event.target.classList.contains('allowed') || event.target.classList.contains('g_middlePlaceholder')) {
        event.dataTransfer.dropEffect = 'move'
      } else {
        // 2. 如果拖动的元素（不）可以放在当前元素上，那么图标效果是（源项目的复制项可能会出现在新位置，鼠标角上有个加号）
        event.dataTransfer.dropEffect = 'copy'
      }
      event.preventDefault()
    }

    // 容器获取焦点，设置右上角的坐标值
    containerMouseovers (e) {
      const num = e.top - 92
      if (num > 0) {
        this.containerBtnAreaTop = num
      } else {
        this.containerBtnAreaTop = 50
      }
      this.containerBtnAreaControl = true
    }

    // 容器失去焦点，隐藏按钮区域
    containerMouseout () {
      this.containerBtnAreaControl = false
    }

    // 点击容器的功能按钮区域
    containerToolBtnChange (title) {
      // console.log(title)
      if (title === '删除' && this.activeContainerIndex >= 0) {
        // 删除容器节点
        this.deleteNodeElement([this.activeContainerIndex])
      } else if (title === '下移') {
        swapItems(this.projectData.elements, this.activeContainerIndex, this.activeContainerIndex + 1)
      } else if (title === '上移') {
        swapItems(this.projectData.elements, this.activeContainerIndex, this.activeContainerIndex - 1)
      }
      // 设置索引为空
      this.setContainerIndex(null)
      // 关闭容器按钮区域
      this.containerBtnAreaControl = false
    }

    // 画板页面失去焦点事件
    editorMainContentMouseout (e) {
      // 如果画板失去焦点，就隐藏容器的按钮区域
      if (e.toElement && e.toElement.classList && e.toElement.classList.contains('editor-pane-inner')) {
        // 设置索引为空
        this.setContainerIndex(null)
        // 关闭容器按钮区域
        this.containerBtnAreaControl = false
      }
    }

    // 兼容当前容器索引值的变化来判断显示的按钮组
    @Watch('activeContainerIndex')
    activeContainerIndexChange (val) {
      this.containerBtnData = [
        {name: '删除', icon: 'iconguanbi'} // name属性很重要代表当前的按钮操作
        // {name: '编辑', icon: 'iconbianji-copy-copy'}
      ]
      if (val >= 0 && val < this.projectData.elements.length - 1) {
        // 添加向下移动的按钮
        this.containerBtnData.push({name: '下移', icon: 'iconxiayi'})
      }
      if (val >= 1) {
        // 添加向下移动的按钮
        this.containerBtnData.push({name: '上移', icon: 'iconshangyi'})
      }
      // 去重
      this.containerBtnData = ArrayRemoval(this.containerBtnData, 'name')
    }
  }
</script>
