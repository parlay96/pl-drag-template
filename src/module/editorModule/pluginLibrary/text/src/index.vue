<template>
  <div class="pl-text" :class="{ editStatus: editStatusFlse } ">
    <pl-edit-div v-model='tempValue'
                 @textClick="childItem.contenteditable = true"
                 :can-edit="childItem.contenteditable"
                 @textFocus="editStatusFlse = true"
                 @textBlur="childItem.contenteditable = false; editStatusFlse = false"
                 :style="{ cursor: childItem.contenteditable ? 'text' : 'default' }"
                 :placeholder="childItem.placeholder"/>
    <!--拖动圆点-->
    <div class="ui-resizable-Line" style="right: -4px" v-if="childItem.uuid === activeElementUUID">
      <div class="ui-resizable-icon edit-shape-point" @mousedown="handleMouseDownOnPoint('r')"/>
    </div>
    <div class="ui-resizable-Line" style="left: -4px" v-if="childItem.uuid === activeElementUUID">
      <div class="ui-resizable-icon edit-shape-point" @mousedown="handleMouseDownOnPoint('l')"/>
    </div>
  </div>
</template>

<script>
  import { createNamespacedHelpers } from 'vuex'
  import { plEditDiv } from '../../index'
  const { mapState } = createNamespacedHelpers('editorModule')
  // 文本输入框
  export default {
    name: 'PlText',
    components: {plEditDiv},
    computed: {
      ...mapState({
        activeElementUUID: state => state.activeElementUUID
      })
    },
    props: {
      value: {
        type: String,
        default: ''
      },
      childItem: {
        type: Object,
        default: () => { return {} }
      }
    },
    data () {
      return {
        tempValue: '',
        editStatusFlse: false
      }
    },
    created () {
      this.tempValue = this.value
    },
    methods: {
      handleMouseDownOnPoint (point) {
        this.$emit('plTextMouseDown', point)
      }
    },
    watch: {
      value (val) {
        this.tempValue = val
      },
      tempValue () {
        this.$emit('input', this.tempValue)
      }
    }
  }
</script>

<style lang="less" scoped>
  .pl-text {
    .ui-resizable-Line {
      position: absolute;
      height: 100%;
      top: 0;
      width: 9px;
    }
    .ui-resizable-icon {
      top: 50%;
      cursor: e-resize;
      margin-top: -4px;
    }
    &:before {
      content: "";
      width: calc(100% - 4px);
      height: calc(100% - 4px);
      position: absolute;
      top: 1px;
      left: 1px;
      border: 1px solid @dh-color;
      display: none;
    }
  }
  .editStatus.pl-text:before {
    display: inline-block;
  }
</style>
