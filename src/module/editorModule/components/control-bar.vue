<template>
  <div class="control-bar-wrapper">
    <div class="components-contrl-bar">
      <div class="button-item scale-wrappper">
        <span class="scale-btn" @click="updateScale('reduce')">
          <i class="el-icon-zoom-out" style="font-size: 20px;"/>
        </span>
        <span class="scale-input">{{ parseFloat(scaleValue * 100).toFixed(0) }}%</span>
        <span class="scale-btn" @click="updateScale('plus')">
          <i class="el-icon-zoom-in" style="font-size: 20px;"/>
        </span>
      </div>
      <div class="button-item btn" @click="save">
        <i class="iconfont iconbaocun"/>
        <p>保存</p>
      </div>
      <div class="button-item btn">
        <i class="iconfont icontuichu"/>
        <p>退出</p>
      </div>
    </div>
  </div>
</template>

<script>
  import { Component, Vue, Prop } from 'vue-property-decorator'
  @Component()
  // 头部控制按钮
  export default class controlBar extends Vue {
    @Prop({ type: Number, default: 1 }) scale
    scaleValue = 1 // 画板缩放
    created () {
      this.scaleValue = this.scale
    }
    // 更新画板大小
    updateScale (type, value) {
      if (type === 'plus') {
        this.scaleValue = this.scaleValue + (value || 0.1) > 2 ? 2 : this.scaleValue + (value || 0.1)
      } else if (type === 'reduce') {
        this.scaleValue = this.scaleValue - (value || 0.1) > 0.5 ? this.scaleValue - (value || 0.1) : 0.5
      }
      this.$emit('update:scale', this.scaleValue)
    }
    // 保存
    save () {
      this.$emit('save')
    }
  }
</script>

<style lang="less" scoped>
  .control-bar-wrapper {
    position: absolute;
    top: -48px;
    left: 0;
    width: 100%;
    text-align: center;
    z-index: 1000;
    .components-contrl-bar {
      display: inline-block;
      height: 48px;
      .scale-wrappper {
        width: 110px;
        margin-right: 10px;
      }
    }
    .btn {
      &:hover {
        color: @dh-color;
      }
    }
    .button-item {
      display: inline-block;
      width: 60px;
      cursor: pointer;
      text-align: center;
      margin-top: 5px;
      vertical-align: bottom;
      font-size: 14px;
      transition: color 0.28s, transform 0.28s;
      user-select: none;
      & > i {
        font-size: 18px;
        display: inline-block;
        transition: all 0.28s;
      }
      & > p {
        font-size: 14px;
      }
    }
    .scale-input {
      display: inline-block;
      position: relative;
      padding: 7px 0;
      width: 46px;
      font-size: 14px;
      text-align: center;
      cursor: pointer;
      white-space: nowrap;
      border-radius: 17px;
      &:hover {
        background: #dfdfdf;
      }
    }
  }
</style>
