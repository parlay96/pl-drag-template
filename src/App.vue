<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import { Component, Vue } from 'vue-property-decorator'
  @Component()
  export default class app extends Vue {
  }
</script>

<style lang="less">
  @import './themes/publicStyle/default.less';
</style>
