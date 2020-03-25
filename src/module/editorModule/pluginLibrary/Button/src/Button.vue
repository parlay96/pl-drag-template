<template>
  <a class="plButton">
    <pl-edit-div v-model='tempValue'
                 nowrap
                 class="user-select"
                 @textClick="childItem.contenteditable = true"
                 :can-edit="childItem.contenteditable"
                 @textBlur="childItem.contenteditable = false"
                 :style="{ cursor: childItem.contenteditable ? 'text' : 'default' }"/>
  </a>
</template>

<script>
  import { plEditDiv } from '../../index'
  export default {
    name: 'PlButton',
    components: {plEditDiv},
    props: {
      value: {
        type: String,
        default: '按钮'
      },
      childItem: {
        type: Object,
        default: () => { return {} }
      }
    },
    data () {
      return {
        tempValue: ''
      }
    },
    created () {
      this.tempValue = this.value
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

<style scoped lang="less">
  .plButton {
    background-color: rgb(255, 114, 20);
    color: rgb(255, 255, 255);
    white-space: nowrap;
    display: block;
    .beyond {overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
    .user-select {-moz-user-select: none;-khtml-user-select: none;user-select: none;}
  }
</style>
