<!--test.vue-->
<template>
  <div class="pl-text">
    {{text}}
  </div>
</template>

<script>
	export default {
		name: 'plText', // 这个名字很重要，它就是未来的标签名<pl-text></pl-text>
		props: {
			text: {
				type: String,
				default: '这是一段文字'
			}
		},
		data() {
			return {
				defaultStyle: {
					height: 40
				}
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
