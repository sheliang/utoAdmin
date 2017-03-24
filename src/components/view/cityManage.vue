<template>
	<div class="home">
		<el-form :inline="true">
			<el-row>
				<el-form-item label="城市名称">
					<!--<el-select v-model="cityName" placeholder="请选择城市" class="padding-right-20">
						<el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.name"></el-option>
					</el-select>-->
					<el-input v-model="cityName" placeholder="请选择城市"></el-input>
				</el-form-item>

				<el-form-item>
					<el-button icon="search" @click="citySelect">查询</el-button>
					<el-button type="primary" icon="plus" @click="cityAdd">添加</el-button>
				</el-form-item>
			</el-row>
		</el-form>

		<el-table :data="cityData" stripe border fit style="width: 100%">
			<el-table-column prop="id" label="城市ID"></el-table-column>
			<el-table-column prop="baiduId" label="百度ID"></el-table-column>
			<el-table-column prop="name" label="城市名称"></el-table-column>
			<el-table-column prop="pinyin" label="简拼"></el-table-column>
			<el-table-column prop="longtitude" label="城市经度"></el-table-column>
			<el-table-column prop="latitude" label="城市纬度"></el-table-column>
			<el-table-column prop="" label="同城开关状态">
				<template scope="props">
					<span>{{props.row.status == "VALID" ? "开" : "关"}}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="320">
				<template scope="scope">
					<el-button type="primary" icon="edit" @click="updateCityInfo(scope.$index, scope.row)">修改</el-button>
					<el-button type="danger" icon="delete" @click="deleteCityInfo(scope.$index, scope.row)">删除</el-button>
					<el-button type="warning" icon="setting" @click="cityDetail(scope.$index, scope.row)">详情</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-pagination layout="prev, pager, next" :total="count" v-if="count > 10" @current-change=""></el-pagination>

		<el-dialog v-model="isEdit" :close-on-click-modal="false">
			<el-form :model="cityInfo" label-width="80px" ref="cityInfo">
				<!--<el-form-item label="城市ID" prop="id">
					<el-input v-model="cityInfo.id" auto-complete="off"></el-input>
				</el-form-item>-->
				<el-form-item label="百度ID" prop="baiduId">
					<el-input v-model="cityInfo.baiduId" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="城市名称" prop="name">
					<el-input v-model="cityInfo.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="简拼" prop="pinyin">
					<el-input v-model="cityInfo.pinyin" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="城市经度" prop="longtitude">
					<el-input v-model="cityInfo.longtitude" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="城市纬度" prop="latitude">
					<el-input v-model="cityInfo.latitude" auto-complete="off"></el-input>
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
		name: 'home',
		data() {
			return {
				cityName: "",
				cityId: "",
				isEdit: false,
				loading: false,
				isAddCity: false,
				count: 1,
				num: 1,
				cityInfo: {
					id: "",
					baiduId: "",
					name: "",
					pinyin: "",
					longtitude: "",
					latitude: "",
					status: ""
				},
				cityData: [],
				cityList: ""
			}
		},
		methods: {
			// 添加城市
			cityAdd() {
				this.isEdit = true;
				this.isAddCity = true;
				this.cityInfo.id = "";
				this.cityInfo.baiduId = "";
				this.cityInfo.name = "";
				this.cityInfo.pinyin = "";
				this.cityInfo.longtitude = "";
				this.cityInfo.latitude = "";
			},
			// 查询城市
			citySelect() {
				var _this = this;
				// 城市列表
				this.$http.post("/cityList.shtml", "value=" + JSON.stringify({
					name: encodeURI(_this.cityName),
					pageNum: _this.num,
					pageSize: 10
				})).then((result) => {
					if(result.code == 200) {
						// 城市管理列表
						_this.cityData = result.data;
						// 城市名称列表
						_this.cityList = result.data;
						// 城市列表总条数
						_this.count = result.appendix;
					}
				}).catch((error) => {
					console.log(error);
				});
			},
			// 点击详情按钮
			cityDetail(idx, row) {
				sessionStorage.setItem("cityDetail", JSON.stringify(row));
				this.$router.push("/city/detail");
			},
			// 点击修改基础信息
			updateCityInfo(idx, row) {
				this.isEdit = true;
				this.isAddCity = false;
				this.cityInfo.id = row.id;
				this.cityInfo.baiduId = row.baiduId;
				this.cityInfo.name = row.name;
				this.cityInfo.pinyin = row.pinyin;
				this.cityInfo.longtitude = row.longtitude;
				this.cityInfo.latitude = row.latitude;
			},
			// 删除城市
			deleteCityInfo(idx, row) {
				var _this = this;
				this.$confirm("确认删除此条记录？", "提示").then(() => {
					_this.loading = true;

					_this.$http.get("/delCity.shtml", {
						params: {
							cityId: row.id
						}
					}).then((result) => {
						if(result.code == 200) {
							_this.$notify({
								title: '成功',
								message: "信息删除成功",
								type: 'success'
							})
							this.citySelect();
						}
						_this.loading = false;
					}).catch((error) => {
						console.log(error);
					});
				}).catch(() => {

				});
			},
			// 点击关闭按钮
			close() {
				this.isEdit = false;
			},
			// 点击提交按钮
			submit() {
				var _this = this;
				if(this.isAddCity) {
					// 添加城市
					this.$http.post("/addCity.shtml", "city=" + JSON.stringify(_this.cityInfo)).then((result) => {
						if(result.code == 200) {
							_this.$notify({
								title: '成功',
								message: "信息添加成功",
								type: 'success'
							})
							this.citySelect();
						}
						_this.isEdit = false;
					}).catch((error) => {
						console.log(error);
					});
				} else {
					// 修改城市基础信息
					var data = {
						id: _this.cityInfo.id,
						baiduId: _this.cityInfo.baiduId,
						latitude: _this.cityInfo.latitude,
						longtitude: _this.cityInfo.longtitude,
						name: _this.cityInfo.name,
						pinyin: _this.cityInfo.pinyin
					}

					this.$http.post("/updateCity.shtml", "city=" + JSON.stringify(data)).then((result) => {
						if(result.code == 200) {
							_this.$notify({
								title: '成功',
								message: "信息修改成功",
								type: 'success'
							});
							this.citySelect();
						}

						_this.isEdit = false;
					}).catch((error) => {
						console.log(error);
					});
				}
			},
			// 分页切换
			currentPage(page) {
				this.num = page;
			}
		},
		created() {
			this.citySelect();
		}
	}
</script>

<style>
	.el-table .cell {
		white-space: nowrap !important;
	}
</style>