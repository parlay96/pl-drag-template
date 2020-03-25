<template>
  <div class="toolBtn">
    <div class="sm-tool-btn"
         :style="toolStyle"
         v-for="(item, index) in iconData"
         @click.stop="toolBtns(item.name)"
         @mousedown.stop="() => true"
         :key="index">
      <i :class="lineType" class="line" v-if="index > 0"/>
      <i class="iconfont sm-btn"
         :class="[item.icon]"
         :title="item.name"/>
    </div>
  </div>
</template>

<script>
  import { Component, Vue, Prop } from 'vue-property-decorator'
  @Component()
  // 组件编辑按钮
  export default class toolBtn extends Vue {
    @Prop({ type: Array, default: () => [] }) iconData
    @Prop({ type: Object, default: () => { return { width: '22px', height: '22px' } } }) toolStyle
    @Prop({ type: String, default: 'verticalLine' }) lineType
    toolBtns (title) {
     this.$emit('toolBtnChange', title)
    }
  }
</script>

<style scoped lang="less">
  .toolBtn {
    overflow: hidden;
    // 横向
    .horizontalLine {
      height: 1px;
      width: 80%;
      left: 10%;
    }
    // 竖向
    .verticalLine {
      width: 1px;
      height: 15px;
      top: 4px;
      left: 0;
    }
    .line {
      display: block;
      position: absolute;
      background-color: #969696;
    }
    .sm-tool-btn {
      color: white;
      float: left;
      text-align: center;
      position: relative;
      background: rgba(51,51,51,.9);
      vertical-align: top;
      cursor: pointer;
      &:hover {
        background-color: #333;
      }
    }
  }
</style>
