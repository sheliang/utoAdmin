<template>
	<router-view></router-view>
</template>

<script>
	export default {
		name: 'home1',
		data() {
			return {

			}
		},
		methods: {

		},
		created() {
			console.log(this.$route.fullPath);
			this.$route.fullPath === "/line" ?this.$router.replace("/line/lineParam") : this.$router.replace(this.$route.fullPath);
		},
		beforeEnter: (to, from, next) => {
			console.log(12345);
		}
	}
</script>

<style>

</style>