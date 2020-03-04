<!--button.vue-->
<template>
  <div class="pl-button">
    {{text}}
  </div>
</template>

<script>
	export default {
		name: 'plButton', // 这个名字很重要，它就是未来的标签名
		props: {
			text: {
				type: String,
				default: '按 钮'
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
