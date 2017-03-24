<template>
	<div class="region">
		<!--面包屑-->
		<el-breadcrumb separator=">">
			<el-breadcrumb-item :to="{ path: '/city/home' }">城市管理</el-breadcrumb-item>
			<el-breadcrumb-item>城市参数</el-breadcrumb-item>
			<el-breadcrumb-item>{{cityName}}</el-breadcrumb-item>
		</el-breadcrumb>

		<el-form :inline="true">
			<el-row>
				<el-form-item class="text-right w800">
					<el-button type="primary" icon="plus" @click="regionAdd">添加</el-button>
				</el-form-item>
			</el-row>
		</el-form>

		<el-table :data="regionData" stripe border style="width: 100%">
			<el-table-column prop="name" label="范围名称"></el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<el-button @click="watch(scope.row)">查看</el-button>
					<el-button type="primary" icon="edit" @click="update(scope.$index,scope.row)">编辑</el-button>
					<el-button type="danger" icon="delete" @click="deleteItem(scope.$index,scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-dialog v-model="isEdit" :close-on-click-modal="false">
			<el-form :model="regionInfo" label-width="80px" ref="regionInfo">
				<el-form-item label="区域名称" prop="name">
					<el-input v-model="regionInfo.name" auto-complete="off" :disabled="isManage"></el-input>
				</el-form-item>
				<el-form-item label="区域简拼" prop="pinyin">
					<el-input v-model="regionInfo.pinyin" auto-complete="off" :disabled="isManage"></el-input>
				</el-form-item>
				<el-form-item label="区域范围" prop="points">
					<baiduMap :cityName="cityName" :regionInfo="regionInfo" :isEdit="isEdit" @message="getPoints"></baiduMap>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="close">取 消</el-button>
				<el-button type="primary" @click.native="submit" :loading="loading" v-if="!isManage">提 交</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				cityId: "",
				cityName: "",
				cityInfo: "",
				count: 0,
				isManage: true,
				isEdit: false,
				isAdd: true,
				idx: 0,
				loading: false,
				pageNum: 1,
				areaName: "",
				regionData: [],
				regionInfo: {
					name: "",
					baiduId: "",
					pinyin: "",
					points: []
				},
				points: []
			}
		},
		components: {
			baiduMap: require("../sub/baiduMap.vue")
		},
		methods: {
			watch(row) {
				this.isManage = true;
				this.isAdd = false;
				this.getAreaInfo(row);
			},
			update(idx, row) {
				this.isManage = false;
				this.isAdd = false;

				this.idx = idx;
				this.getAreaInfo(row);
			},
			getAreaInfo(row) {
				var _this = this;
				// 获取覆盖范围信息
				this.$http.get("/queryCityAreaInfo.shtml", {
					params: {
						id: _this.cityId,
						name: row.name
					}
				}).then(result => {
					if(result.code == 200) {
						_this.regionInfo.name = result.data.name;
						_this.regionInfo.pinyin = result.data.pinyin;
						_this.regionInfo.points = result.data.points;
					}
					_this.isEdit = true;
				}).catch((error) => {
					console.log(error);
				});
			},
			deleteItem(idx, row) {
				// 删除数据
				var _this = this;
				this.$confirm('确认删除该条数据?', '提示', {
					type: 'warning'
				}).then(() => {
					_this.loading = true;

					_this.$http.get("/delCityArea.shtml", {
						params: {
							id: _this.cityId,
							pinyin: row.pinyin
						}
					}).then(result => {
						if(result.code == 200) {
							_this.$notify({
								title: '成功',
								message: '删除成功',
								type: 'success'
							});
							_this.getAreaList();
						}
						_this.loading = false;
					}).catch((error) => {
						console.log(error);
					});
				}).catch(() => {

				});
			},
			regionAdd() {
				this.isAdd = true;
				this.isManage = false;

				this.regionInfo.name = "";
				this.regionInfo.pinyin = "";
				this.regionInfo.points = "";

				this.isEdit = true;
			},
			close() {
				this.isEdit = false;
			},
			submit() {
				var _this = this;

				this.regionInfo.points = this.points;
				if(this.isAdd) {
					// 添加覆盖范围
					this.$http.post("/addCityArea.shtml", "area=" + JSON.stringify(_this.regionInfo) + "&id=" + _this.cityId).then(result => {
						if(result.code == 200) {
							_this.$notify({
								title: '成功',
								message: '添加成功',
								type: 'success'
							});
							_this.getAreaList();
						}
						_this.isEdit = false;
					}).catch((error) => {
						console.log(error);
					});
				} else {
					// 修改覆盖范围
					this.$http.post("/updateCityArea.shtml", "id=" + _this.cityId + "&areaName=" + _this.regionData[_this.idx].name + "&area=" + JSON.stringify(_this.regionInfo)).then(result => {
						if(result.code == 200) {
							_this.$notify({
								title: '成功',
								message: '修改成功',
								type: 'success'
							})
							_this.getAreaList();
						}
						_this.isEdit = false;
					}).catch((error) => {
						console.log(error);
					});
				}
			},
			getPoints(points) {
				this.points = points;
			},
			getAreaList() {
				var _this = this;
				// 初始化区域列表
				this.$http.post("/queryCityAreaList.shtml", "params=" + JSON.stringify({
					pageNum: _this.pageNum,
					pageSize: 10,
					areaName: _this.areaName,
					id: _this.cityId
				})).then(result => {
					if(result.code == 200) {
						_this.regionData = result.data;
					}
				}).catch((error) => {
					console.log(error);
				});
			}
		},
		created() {
			this.cityInfo = JSON.parse(sessionStorage.getItem("cityDetail"));
			sessionStorage.getItem("tabIdx") ? this.cityDetail = sessionStorage.getItem("tabIdx") : "";
			this.cityName = this.cityInfo.name;
			this.cityId = this.cityInfo.id;
			this.regionInfo.baiduId = this.cityInfo.baiduId;

			this.getAreaList();
		}
	}
</script>

<style>

</style>