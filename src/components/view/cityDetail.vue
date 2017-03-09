<template>
	<div class="cityDetail">
		<el-tabs :active-name="cityDetail" v-model="cityDetail" type="card" @tab-click="handleClick">
			<el-tab-pane label="覆盖范围" name="first">
				<el-breadcrumb separator="/">
					<el-breadcrumb-item :to="{ path: '/home' }">城市管理</el-breadcrumb-item>
					<el-breadcrumb-item>城市参数</el-breadcrumb-item>
					<el-breadcrumb-item>{{cityName}}</el-breadcrumb-item>
				</el-breadcrumb>

				<div class="text-right w1000">
					<el-button type="primary" icon="plus" @click="regionAdd">添加</el-button>
				</div>
				<br />
				<el-table :data="regionData" stripe border style="width: 100%">
					<el-table-column prop="name" label="范围名称"></el-table-column>
					<el-table-column label="操作">
						<template scope="scope">
							<el-button type="primary" @click="watch(scope.row)">查看</el-button>
							<el-button type="primary" @click="update(scope.row)">编辑</el-button>
							<el-button type="primary" @click="deleteItem(scope.index)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="同城价" name="second">同城价</el-tab-pane>
			<el-tab-pane label="调价区域" name="third">调价区域</el-tab-pane>
		</el-tabs>

		<el-dialog v-model="isEdit" :close-on-click-modal="false">
			<el-form :model="regionInfo" label-width="80px" ref="regionInfo">
				<el-form-item label="区域名称" prop="regionName">
					<el-input v-model="regionInfo.regionName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="区域简拼" prop="jp">
					<el-input v-model="regionInfo.jp" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="区域范围" prop="fw">
					<div id="map"></div>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="close">取 消</el-button>
				<el-button type="primary" @click.native="submit" :loading="loading">提 交</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: "cityDetail",
		data() {
			return {
				cityDetail: "first",
				cityName: "",
				cityId: "",
				isEdit: false,
				loading: false,
				regionData: [{
					name: "三环内"
				}, {
					name: "双流机场"
				}],
				regionInfo: {
					regionName: "",
					jp: "",
					fw: ""
				}
			}
		},
		methods: {
			handleClick() {
				sessionStorage.setItem("tabIdx", this.cityDetail);
			},
			watch(row) {
				console.log(row)
			},
			update(row) {
				console.log(row);
			},
			deleteItem(index) {
				console.log(index);
			},
			regionAdd() {
				this.isEdit = true;

				regionInfo.regionName = "";
				regionInfo.jp = "";
				regionInfo.fw = "";
			},
			close() {
				this.isEdit = false;
			},
			submit() {
				console.log("提交");
			}
		},
		created() {
			// console.log(this.$route.query);
			sessionStorage.getItem("tabIdx") ? this.cityDetail = sessionStorage.getItem("tabIdx") : "";
			this.cityName = this.$route.query.cityName;
			this.cityId = this.$route.query.cityId;

			//			this.$message({
			//				message: "这是一条提示消息",
			//				type: "success"
			//			});
			//
			//			setTimeout(() => {
			//				this.$notify({
			//					title: '成功',
			//					message: '这是一条成功的提示消息',
			//					type: 'success'
			//				});
			//			},1000)
		}
	}
</script>

<style>

</style>