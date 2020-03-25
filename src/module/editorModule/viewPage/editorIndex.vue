<template>
  <div class="page-editor">
    <!--组件&页面&模板-->
    <div class="editor-page-edit-wrapper">
      <componentLibs/>
    </div>
    <!--页面编辑区域-->
    <div class="editor-main">
      <control-bar :scale.sync="projectData.scale" @save="saveEditor"/>
      <editor-pan/>
    </div>
    <!--属性编辑区域-->
    <div class="el-attr-edit-wrapper">
      <div class="editorDrawer"
           :style="{ width: editorDrawer ? editorDrawerWidth + 'px' : '0' }"
           ref="editorDrawer">
        <el-tabs v-model="activeAttr" stretch v-if="editorDrawer">
          <el-tab-pane label="属性" name="a">
            属性-----根据自己的实际组件自己配置
          </el-tab-pane>
          <el-tab-pane label="样式" name="b">
            样式-----根据自己的实际组件自己配置
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
  import { Component, Vue, Watch } from 'vue-property-decorator'
  import componentLibs from '../components/componentLibs'
  import editorPan from '../components/editorPan'
  import controlBar from '../components/control-bar'
  import {namespace} from 'vuex-class'
  const editorModule = namespace('editorModule')
  @Component({components: { componentLibs, editorPan, controlBar }, name: 'editorIndex'})
  // 可视化页面编辑器入口
  export default class editorIndex extends Vue {
    @editorModule.State('projectData') projectData
    @editorModule.State('activeElementUUID') activeElementUUID
    activeAttr = 'a'
    editorDrawerWidth = 405 // 编辑栏的宽度
    editorDrawer = false // 控制编辑栏弹窗
    // 保存模板
    saveEditor () {
      console.log(this.projectData)
    }

    // 监听当前选中项，如果存在就打开右边侧滑框进行配置
    @Watch('activeElementUUID')
    activeElementUUIDChange (val) {
      // 开打弹窗
      if (val) {
        this.editorDrawer = true
      } else {
        this.editorDrawer = false
      }
    }
  }
</script>

<style lang="less" scoped>
  .page-editor {
    display: flex;
    min-width: 1280px;
    height: 100%;
    position: relative;
    .editor-page-edit-wrapper {
      width: 210px;
      padding: 0 1px;
    }
    .editor-main {
      flex: 1;
      position: relative;
    }
    .el-attr-edit-wrapper {
      height: 100%;
      position: relative;
      background-color: #f0f0f0;
      width: 405px;
      padding: 0;
      .editorDrawer {
        height: 100%;
        overflow: hidden;
        transition: width .3s;
        position: absolute;
        top: 0;
        right: 0;
        background-color: white;
      }
    }
  }
</style>
