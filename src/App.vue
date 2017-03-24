<template>
	<el-row class="panel">
		<el-col :span="24" class="panel-top">
			<p>专车后台管理系统v1.0</p>
		</el-col>
		<el-col :span="24" class="panel-center">
			<aside class="panel-left">
				<el-menu :default-active="menuIdx" class="el-menu-vertical-demo" theme="dark" unique-opened router @select="handleSelect">
					<el-submenu index="1">
						<template slot="title"><i class="el-icon-message"></i>城市管理</template>
						<el-menu-item-group>
							<el-menu-item index="/city/home">城市参数</el-menu-item>
							<el-menu-item index="/city/region">区域管理</el-menu-item>
							<el-menu-item index="/city/position">定点管理</el-menu-item>
						</el-menu-item-group>
					</el-submenu>
					<el-submenu index="2">
						<template slot="title"><i class="el-icon-menu"></i>线路管理</template>
						<el-menu-item-group>
							<el-menu-item index="/line/lineParam">线路参数</el-menu-item>
						</el-menu-item-group>
					</el-submenu>
				</el-menu>
			</aside>

			<section class="panel-right">
				<div class="grid-content bg-purple-light">
					<router-view></router-view>
				</div>
			</section>
		</el-col>
	</el-row>
</template>

<script>
	export default {
		data() {
			return {
				menuIdx: ""
			}
		},
		watch: {

		},
		methods: {
			handleSelect(key) {
				sessionStorage.setItem('menuIdx', key);
			}
		},
		created() {
			this.menuIdx = sessionStorage.getItem('menuIdx') ? sessionStorage.getItem('menuIdx') : "/city/home";
		}
	}
</script>

<style scoped>
	.panel-center {
		position: relative;
		width: 100%;
		height: calc(100% - 53px);
	}
	
	.panel-left {
		width: 240px;
		height: 100%;
	}
	
	.panel-left>.el-menu {
		height: 100%;
	}
	
	.panel-right {
		position: absolute;
		left: 240px;
		right: 0;
		top: 0;
		bottom: 0;
		padding: 20px;
	}
	
	.panel {
		height: 100%;
	}
</style>