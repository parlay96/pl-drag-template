<!--test.vue-->
<template>
  <div class="pl-textarea">
    <textarea class="pl-textarea-item" :placeholder="placeholder" v-model="tempValue"/>
  </div>
</template>

<script>
	export default {
		name: 'plTextarea',
		props: {
			placeholder: {
				type: String,
				default: '请输入'
			},
			value: {
				require: false
			}
		},
		data() {
			return {
				tempValue: ''
			}
		},
		created() {
			this.tempValue = this.value;
		},
		watch: {
			value(val) {
				this.tempValue = val;
			},
			tempValue() {
				this.$emit('input', this.temp)
			}
		}
	}
</script>

<style lang="scss" scoped>
  .pl-textarea-item {
    display: block;
    width: 100%;
    height: 100%;
    outline: none;
    border: none;
  }
</style>
