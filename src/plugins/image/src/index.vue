<!--test.vue-->
<template>
  <div class="pl-image">
    <img :src="imageSrc" alt="">
  </div>
</template>

<script>
	export default {
		name: 'plImage', // 这个名字很重要，它就是未来的标签名<pl-text></pl-text>
		props: {
			imageSrc: {
				type: String,
        default: 'http://seopic.699pic.com/photo/50051/4111.jpg_wh1200.jpg'
      }
		}
	}
</script>

<style lang="scss" scoped>
  .pl-image{
    width: 100%;
    height: 100%;
  }
  img{
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
