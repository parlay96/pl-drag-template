<template>
  <div class="carousel">
    <el-carousel trigger="click" :height="carouselHeight + 'px'">
      <el-carousel-item v-for="item in 4" :key="item">
        <h3 class="small">{{ item }}</h3>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
  // 多图文轮播
  export default {
    name: 'Carousel',
    props: {
      childItem: {
        type: Object,
        default: () => { return {} }
      }
    },
    data () {
      return {
        carouselHeight: 150
      }
    }
  }
</script>

<style lang="less">
  .carousel {
    position: relative;
    z-index: 1;
    .el-carousel__item {
      background-color: #cccccc;
      text-align: center;
    }
    .el-carousel__button {
      width: 10px;
      height: 10px;
      border-radius: 10px;
    }
  }
</style>
