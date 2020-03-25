<template>
  <div class="components-libs-wrapper scrollbar-wrapper">
    <p class="page-title text-center">组件库</p>
    <el-scrollbar style="height: 100%;">
      <ul class="scrollbar-wrapper">
        <li v-for="(item, index) in componentsList" :key="index" class="clearfix paddingB30">
          <div class="components-libs-title">
            <p>{{ item.title }}</p>
          </div>
          <div v-if="item.components && item.components.length">
            <div class="components-lib-item"
                 v-for="(element,i) in item.components"
                 draggable="true"
                 :id="element.elName"
                 :ref="element.elName"
                 :key="i"
                 @click="handleClicks(element)"
                 @dragend="dragend"
                 @dragstart="dragstart(element)">
              <div class="lib-item-img">
                <i :class="[element.icon]"/>
              </div>
              <p class="lib-item-title">{{ element.title }}</p>
            </div>
          </div>
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>

<script>
  import eleConfig from '../utils/ele-config'
  import { Component, Vue } from 'vue-property-decorator'
  import { getComponentProps } from '../utils/methods'
  import { namespace } from 'vuex-class'
  const editorModule = namespace('editorModule')
  @Component({ methods: { getComponentProps } })
  // 模块的tab表
  export default class componentLibs extends Vue {
    @editorModule.Mutation('addElement') addElement
    @editorModule.Mutation('setMiddlePlaceholder') setMiddlePlaceholder
    // 组件列表
    componentsList = eleConfig

    // 点击事件, 添加节点
    handleClicks (item) {
      this.addElement(item)
      // 非父子组件通信（需要调用画板页面的方法）
      this.$bus.$emit('editorScroll')
    }

    /* 拖动时触发 具体请看 html5 DataTransfer对象 */
    dragstart (ele) {
      let downEvent = event
      // 拖开启设置容器提示框为显示状态
      this.setMiddlePlaceholder(true)
      //       IE e.originalEvent.dataTransfer.setData 报错
      //       错误1：意外地调用了方法或属性访问。
      // 解决办法：
      // setData（key,value)的key只能从Text或者text取一个，我不知道还有没有其他合法的字符；
      //
      //     错误2： 参数无效。
      //     setData（key,value) 显示的将value转换成字符串，不知道还能不能传别的，我传number的时候报错；
      // dataTransfer.setData()方法设置数据类型和拖动的数据
      downEvent.dataTransfer.setData('text', JSON.stringify(ele))
      // 指定拖放操作所允许的一个效果
      downEvent.dataTransfer.effectAllowed = 'copyMove'
    }

    /* 当拖动操作结束时（通过释放鼠标按钮或按退出键），将触发此事件。具体请看 html5 DataTransfer对象 */
    dragend (event) {
      this.setMiddlePlaceholder(false)
    }
  }
</script>

<style lang="less" scoped>
  .components-libs-wrapper {
    user-select: none;
    height: 100%;
    padding-top: 60px;
    position: relative;
    & ul {
      padding: 10px;
    }
  }

  .page-title {
    position: absolute;
    top: 16px;
    left: 0;
    width: 100%;
  }

  .components-libs-title {
    margin-bottom: 16px;
  }

  .components-lib-item {
    color: #424242;
    text-align: center;
    background: #f4f4f4;
    width: 80px;
    float: left;
    padding: 6px 0;
    margin: 5px;
    border: 1px solid #dddddd;
    font-size: 12px;
    cursor: pointer;
    transition: All 0.3s ease-in-out;
    &:hover {
      background: #fff;
      border: 1px solid @dh-color;
      color: @dh-color;
    }
    .lib-item-img {

    }
    .lib-item-title {

    }
  }
</style>
