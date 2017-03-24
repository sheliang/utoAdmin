<template>
	<div class="cityDetail">
		<el-tabs :active-name="cityDetail" v-model="cityDetail" type="card" @tab-click="handleClick">
			<el-tab-pane label="覆盖范围" name="first">
				<region></region>
			</el-tab-pane>
			<el-tab-pane label="同城价" name="second">
				<city></city>				
			</el-tab-pane>
			<el-tab-pane label="调价区域" name="third">
				<priceregion></priceregion>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import region from "./city/region.vue"
	import city from "./city/city.vue"
	import priceregion from "./city/priceregion.vue"
	export default {
		name: "cityDetail",
		data() {
			return {
				cityDetail: "first"
			}
		},
		methods: {
			handleClick() {
				sessionStorage.setItem("tabIdx", this.cityDetail);
			}
		},		
		components: {
			region,
			city,
			priceregion
		},
		created() {
			this.cityDetail = sessionStorage.getItem("tabIdx") ? sessionStorage.getItem("tabIdx") : "first";
		}
	}
</script>

<style>
	#map {
		width: 100%;
		height: 500px;
		border: 1px solid #969696;
		margin-top: 15px;
	}
	
	.icon-top {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-image: url(../../../static/images/top.png);
		background-repeat: no-repeat;
		background-size: cover;
		vertical-align: middle;
		cursor: pointer;
	}
	
	.price-input {
		width: 50px !important;
	}
</style>