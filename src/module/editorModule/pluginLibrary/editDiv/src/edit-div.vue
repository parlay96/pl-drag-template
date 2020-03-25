<template>
  <div class="edit-div"
       v-html="innerText"
       ref="editDiv"
       :placeholder="placeholder"
       @click="textClick"
       :contenteditable="canEdit"
       @keydown.13="keyDown($event)"
       @focus="textFocus"
       @blur="textBlur"
       @input="changeText"/>
</template>
<script>
  // 文本编辑器
  export default {
    name: 'PlEditDiv',
    props: {
      value: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: ''
      },
      canEdit: {
        type: Boolean,
        default: true
      },
      // 禁止换行
      nowrap: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        innerText: this.value,
        isLocked: false
      }
    },
    watch: {
      'value' () {
        if (!this.isLocked && !this.innerText) {
          this.innerText = this.value
        }
      }
    },
    created () {
      this.innerText = this.value
    },
    methods: {
      textFocus () {
        this.$emit('textFocus')
      },
      textClick () {
        this.isLocked = true
        this.$emit('textClick')
        this.$nextTick(function () {
          this.$refs.editDiv.focus()
        })
      },
      textBlur () {
        this.isLocked = false
        this.$emit('textBlur')
      },
      changeText () {
        // 解决：末尾换行，看不见的<br>，删不掉，造成清空无法出现placeholder文字
        if (this.$el.innerHTML === '<br>') {
          this.$el.innerHTML = ''
        }
        this.$emit('input', this.$el.innerHTML)
      },
      keyDown (e) {
        if (this.nowrap) {
          e.preventDefault()
        }
      }
    }
  }
</script>
<style lang="less">
  .edit-div {
    position: relative;
    width: 100%;
    height: 100%;
    word-break: break-all;
    outline: none;
    white-space: pre-wrap;
  }
  .edit-div[contenteditable=true]{
    user-modify: read-write-plaintext-only;
    -webkit-user-modify: read-write-plaintext-only;
  }
  .edit-div[contenteditable]:empty:not(:focus):before {
    content: attr(placeholder);
    color: #aaa ;
  }
</style>
