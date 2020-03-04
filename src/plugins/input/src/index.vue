<!--test.vue-->
<template>
  <div class="pl-input">
    <input class="pl-input-item" v-model="value" :placeholder="placeholder" type="text">
  </div>
</template>

<script>
	export default {
		name: 'plInput',
		props: {
			placeholder: {
				type: String,
        default: '请输入'
      },
			value: {
				require: false
      }
		},
    data(){
			return {

      }
    }
	}
</script>

<style lang="scss" scoped>
.pl-input-item{
  display: block;
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
}
</style>
