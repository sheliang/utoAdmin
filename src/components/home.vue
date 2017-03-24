<template>
	<router-view></router-view>
</template>

<script>
	export default {
		name: 'home',
		data() {
			return {

			}
		},
		methods: {

		},
		created() {
			this.$route.fullPath === "/" ? this.$router.replace("/city/home") : this.$router.replace(this.$route.fullPath);
		}
	}
</script>

<style>

</style>