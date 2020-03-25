<template>
  <el-container class="avue-contail">
    <el-header class="avue-haeder" style="height: 48px">
      <div class="title">pl-drag-template可视化编辑器</div>
    </el-header>
    <el-main class="avue-main"><router-view/></el-main>
  </el-container>
</template>
<script>
  import { Component, Vue } from 'vue-property-decorator'
  @Component({
    components: { }
  })
  export default class layoutIndex extends Vue {
  }
</script>

<style lang="less">
  .avue-contail {
    width: 100%;
    height: 100%;
    // 顶部
    .avue-haeder {
      position: relative;
      width: 100%;
      height: 48px;
      line-height: 48px;
      padding-left: 12px;
      padding-right: 12px;
      background: white;
      box-shadow: 0px 1px 4px 0px rgba(195, 195, 195, 0.6);
      .title{
        display: inline-block;
      }
    }
    // 下部
    .avue-main {
      height: 100%;
      padding: 0 !important;
      overflow: inherit !important;
      position: relative;
    }
  }
</style>
