<template>
	<div class="region">
		<el-form :inline="true" class="demo-form-inline">
			<el-row>
				<el-form-item label="城市名称">
					<el-select v-model="currentCityName" placeholder="请选择城市" @change="getCityInfo">
						<el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="区域名称">
					<el-input v-model="regionName" placeholder="请输入区域名称" class="padding-right-20 w217"></el-input>
					<el-form-item>
						<el-button icon="search" @click="regionSelect">查询</el-button>
						<el-button type="primary" icon="plus" @click="regionAdd">添加区域</el-button>
					</el-form-item>
				</el-form-item>
			</el-row>
		</el-form>

		<el-table :data="regionData" stripe border style="width: 100%">
			<el-table-column prop="cityId" label="区域ID"></el-table-column>
			<el-table-column prop="name" label="区域名称"></el-table-column>
			<el-table-column prop="pinyin" label="区域简拼"></el-table-column>
			<el-table-column prop="cityName" label="所属城市"></el-table-column>
			<el-table-column label="操作" width="280">
				<template scope="scope">
					<el-button @click="regionDetail(scope.$index, scope.row)">查看</el-button>
					<el-button type="primary" icon="edit" @click="updateRegionInfo(scope.$index, scope.row)">修改</el-button>
					<el-button type="danger" icon="delete" @click="regionDelete(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-pagination layout="prev, pager, next" :total="acount" v-if="acount > 10"></el-pagination>

		<el-dialog v-model="isEdit" :close-on-click-modal="false">
			<el-form :model="regionInfo" label-width="80px" ref="regionInfo">
				<el-form-item label="所属城市" prop="cityId">
					<el-select v-model="currentCityName" placeholder="请选择城市" @change="getCityInfo" :disabled="isAddRegion">
						<el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item"></el-option>
					</el-select>
					<!--<el-input v-model="regionInfo.cityId" auto-complete="off" :disabled="isAddRegion"></el-input>-->
				</el-form-item>
				<el-form-item label="区域名称" prop="name">
					<el-input v-model="regionInfo.name" auto-complete="off" :disabled="isAddRegion"></el-input>
				</el-form-item>
				<el-form-item label="区域简拼" prop="pinyin">
					<el-input v-model="regionInfo.pinyin" auto-complete="off" :disabled="isAddRegion"></el-input>
				</el-form-item>
				<el-form-item label="区域范围" prop="points">
					<template scope="scope">
						<baiduMap :cityName="cityName" :regionInfo="regionInfo" :isEdit="isEdit" @message="getPoints"></baiduMap>
					</template>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="close">取 消</el-button>
				<el-button type="primary" @click.native="submit" :loading="loading" v-if="!isAddRegion">提 交</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'regionManage',
		data() {
			return {
				cityId: "",
				cityName: "",
				currentCityName: "",
				regionName: "",
				isEdit: false,
				loading: false,
				isAddRegion: false,
				acount: 1,
				pageNum: 1,
				regionInfo: {
					cityId: "",
					name: "",
					pinyin: "",
					cityName: "",
					points: []
				},
				regionData: [],
				cityList: [],
				points: []
			}
		},
		components: {
			baiduMap: require("./sub/baiduMap.vue")
		},
		methods: {
			// 添加区域
			regionAdd() {
				this.isAddCity = true;
				this.isAddRegion = false;
				this.regionInfo.cityId = "";
				this.regionInfo.name = "";
				this.regionInfo.pinyin = "";
				this.regionInfo.points = [];
				if(typeof(this.currentCityName) == "object") {
					this.cityName = this.currentCityName.name;
				} else {
					this.cityName = this.currentCityName;
				}

				setTimeout(() => {
					this.isEdit = true;
				}, 0);
			},
			// 查询区域
			regionSelect() {
				this.getAreaList();
			},
			// 点击查看按钮
			regionDetail(idx, row) {
				this.isAddRegion = true;
				this.getAreaInfo(row);
			},
			// 点击修改
			updateRegionInfo(idx, row) {
				this.isAddRegion = false;
				this.getAreaInfo(row);
			},
			// 获取指定区域信息
			getAreaInfo(row) {
				var _this = this;
				var data = "param=" + JSON.stringify({
					cityId: row.cityId,
					name: row.name
				});
				this.$http.post("/queryPriceAdjustAreaInfo.shtml", data).then(result => {
					if(result.code == 200) {
						_this.regionInfo.cityId = result.data.cityId;
						_this.regionInfo.name = result.data.name;
						_this.regionInfo.pinyin = result.data.pinyin;
						_this.regionInfo.points = result.data.points;
						_this.regionInfo.cityName = row.cityName;

						_this.currentCityName = row.cityName;
						setTimeout(() => {
							_this.isEdit = true;
						}, 0);
					}
				}).catch(error => {
					console.log(error);
				})
			},
			// 点击关闭按钮
			close() {
				this.isEdit = false;
				this.currentCityName = "";
			},
			// 删除区域
			regionDelete(row) {
				// 删除数据
				var _this = this;
				this.$confirm('确认删除该条数据?', '提示', {
					type: 'warning'
				}).then(() => {
					_this.loading = true;

					var data = "param=" + JSON.stringify({
						cityId: row.cityId,
						name: row.name
					});
					_this.$http.post("/delPriceAdjustAreaInfo.shtml", data).then(result => {
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
			// 点击提交按钮
			submit() {
				var _this = this;
				var data = "param=" + JSON.stringify({
					cityId: _this.regionInfo.cityId,
					name: _this.regionInfo.name,
					pinyin: _this.regionInfo.pinyin,
					points: _this.points
				});
				if(this.isAddCity) {
					// 新增
					this.$http.post("/addPriceAdjustArea.shtml", data).then(result => {
						if(result.code == 200) {
							_this.$notify({
								title: '成功',
								message: "信息添加成功",
								type: 'success'
							});
							_this.getAreaList();
						}
						_this.isEdit = false;
					}).catch(error => {
						console.log(error);
					})
				} else {
					// 修改
					this.$http.post("/updatePriceAdjustArea.shtml", data).then(result => {
						if(result.code == 200) {
							_this.$notify({
								title: '成功',
								message: "信息修改成功",
								type: 'success'
							});
							_this.getAreaList();
						}

						_this.isEdit = false;
					}).catch(error => {
						console.log(error);
					})
				}
				this.currentCityName = "";
			},
			// 初始化区域列表
			getAreaList() {
				var _this = this;
				var data = "pageNum=" + _this.pageNum + "&pageSize=10" + "&param=" + JSON.stringify({
					cityId: _this.regionInfo.cityId,
					name: _this.regionName
				});
				this.$http.post("/cityPriceAdjustList.shtml", data).then(result => {
					if(result.code == 200) {
						_this.regionData = result.data;
					}
				}).catch(error => {
					console.log(error);
				})
			},
			// 初始化城市列表
			getCityList() {
				var _this = this;
				this.$http.post("/cityList.shtml", "value=" + JSON.stringify({
					name: "",
					pageNum: 1,
					pageSize: 1000
				})).then((result) => {
					if(result.code == 200) {
						_this.cityList = result.data;
					}
				}).catch((error) => {
					console.log(error);
				});
			},
			getPoints(points) {
				this.points = points;
			},
			getCityInfo(ops) {
//				this.cityId = ops.id;
//				console.log(ops);
//				this.regionInfo.cityId = ops.id;
//				this.regionInfo.cityName = ops.name;
//
//				this.cityList.cityId = ops.id;
//				this.cityList.cityName = ops.name;
			}
		},
		created() {
			this.getAreaList();
			this.getCityList();
		},
		watch: {
			"currentCityName": function(city) {
				if(typeof(this.currentCityName) == "object") {
					console.log(city);
					this.cityName = this.currentCityName.name;
					this.regionInfo.cityId = city.id;
				} else {
					this.cityName = this.currentCityName;
				}
			}
		}
	}
</script>

<style>
	.el-table .cell {
		white-space: nowrap !important;
	}
</style>