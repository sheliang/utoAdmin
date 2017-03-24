<template>
	<div class="city">
		<el-breadcrumb separator=">">
			<el-breadcrumb-item :to="{ path: '/city/home' }">城市管理</el-breadcrumb-item>
			<el-breadcrumb-item>城市参数</el-breadcrumb-item>
			<el-breadcrumb-item>{{cityName}}</el-breadcrumb-item>
		</el-breadcrumb>

		<el-form :inline="true" class="br">
			<el-row>
				<el-form-item label="同城开关" label-width="70px">
					<el-switch v-model="radio" on-color="#13ce66" off-color="#ff4949" @change="changeCityState"></el-switch>
				</el-form-item>
			</el-row>

			<el-row v-if="!isAdded">
				<el-form-item label="起步价" label-width="70px">
					<el-input v-model="priceStart" class="inline-input w217"></el-input>
					<span>元</span>
				</el-form-item>

				<el-form-item label="包含公里" label-width="120px">
					<el-input v-model="kilometre" class="inline-input w217"></el-input>
					<span>公里</span>
				</el-form-item>
			</el-row>

			<el-row v-if="!isAdded">
				<el-form-item class="text-right w800">
					<el-button type="primary" icon="plus" @click="cityAdd">添加</el-button>
				</el-form-item>
			</el-row>
		</el-form>

		<el-table :data="cityPriceData" stripe border fit style="width: 100%" id="cityPriceTable">
			<el-table-column prop="price" label="起步价"></el-table-column>
			<el-table-column prop="mileage" label="起步公里数"></el-table-column>
			<el-table-column prop="extraPrices" width="400" label="超里程价">
				<template scope="props">
					<el-table :data="props.row.extraPrices" stripe style="width: 100%;">
						<el-table-column prop="" label="适用公里数">
							<template scope="props">
								<span>{{props.row.mileageStart}} —— {{props.row.mileage}} 公里</span>
							</template>
						</el-table-column>
						<el-table-column prop="price" label="单价"></el-table-column>
					</el-table>
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<div>
						<el-button type="primary" icon="edit" @click="cityUpdata(scope.$index,scope.row)">修改</el-button>
						<el-button type="danger" icon="delete" @click="cityDel(scope.row)">删除</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>

		<el-dialog v-model="isEditCity" :close-on-click-modal="false">
			<el-form :model="cityPriceInfo" label-width="100px" ref="cityPriceInfo">
				<el-form-item label="起步价" prop="price">
					<el-input v-model="cityPriceInfo.price" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="起步公里数" prop="mileage">
					<el-input v-model="cityPriceInfo.mileage" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="超里程价" prop="extraPrices">
					<el-table :data="cityPriceInfo.extraPrices" stripe border style="width: 100%;">
						<el-table-column prop="price" label="适用公里数" width="220">
							<template scope="scope">
								<el-input :disabled="true" v-model="scope.row.mileageStart" class="price-input"></el-input>
								——
								<el-input :disabled="(scope.$index + 1) < cityPriceInfo.extraPrices.length" v-model="scope.row.mileage" class="price-input"></el-input>
								公里
							</template>
						</el-table-column>
						<el-table-column label="单价">
							<template scope="props">
								<el-input v-model="props.row.price" class="price-input"></el-input>元
							</template>
						</el-table-column>
						<el-table-column label="操作" width="140">
							<template scope="scope">
								<div class="cityPriceActionBox" v-if="(scope.$index + 1) == cityPriceInfo.extraPrices.length">
									<el-button type="primary" icon="plus" @click.native="addExtraPrice(scope.row)"></el-button>
									<el-button type="danger" icon="delete2" @click.native="delExtraPrice(scope.row,scope.$index)"></el-button>
								</div>
							</template>
						</el-table-column>
					</el-table>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="closeCity">取 消</el-button>
				<el-button type="primary" @click.native="submitCity" :loading="loadingCity">提 交</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				// 同城价
				cityId: "",
				cityName: "",
				cityInfo: "",
				radio: false,
				kilometre: "",
				priceStart: "",
				isAdded: false,
				cityPriceData: [{
					id: "",
					price: "",
					mileage: "",
					extraPrices: [{
						start: "",
						end: "",
						price: ""
					}]
				}],
				isEditCity: false,
				loadingCity: false,
				cityPriceInfo: {
					price: "",
					mileage: "",
					extraPrices: [{
						start: "",
						end: "",
						price: ""
					}]
				},
				rowNum: 1
			}
		},
		methods: {
			cityAdd() {
				// 同城价 添加
				var _this = this;
				if(_this.priceStart == "") {
					_this.$message({
						message: "请输入起步价",
						type: "error"
					});
					return false;
				}
				if(_this.kilometre == "") {
					_this.$message({
						message: "请输入包含公里数",
						type: "error"
					});
					return false;
				}

				var data = "id=" + _this.cityId + "&param={price:" + _this.priceStart + ",mileage:" + _this.kilometre + "}";

				this.$http.post("/cityPriceAdd.shtml", data).then(result => {
					if(result.code == 200) {
						_this.$notify({
							title: '成功',
							message: "添加成功",
							type: 'success'
						});

						_this.getCityPriceList();
					}
				}).catch(error => {
					console.log(error);
				})
			},
			closeCity() {
				this.isEditCity = false;
			},
			submitCity() {
				var _this = this;
				// 同城价格修改
				// var data = "id=" + this.cityId + "&param={priceId:" + this.cityPriceInfo.id + "&price:" + this.cityPriceInfo.price + "&mileage:" + this.cityPriceInfo.mileage + "&extraPrices=" + JSON.stringify(this.cityPriceInfo.extraPrices) + "}";
//				var data = "param=" + JSON.stringify({
//					priceId: _this.cityPriceInfo.id,
//					price: _this.cityPriceInfo.price,
//					mileage: _this.cityPriceInfo.mileage,
//					extraPrices: [{
//						price: "",
//						mileage: ""
//					}]
//				});
				var data = "param=" + JSON.stringify(this.cityPriceInfo);

				this.$http.post("/cityPriceUpdate.shtml", data).then(result => {
					if(result.code == 200) {
						_this.$notify({
							title: '成功',
							message: "修改成功",
							type: 'success'
						});

						_this.getCityPriceList();
					}
				}).catch(error => {
					console.log(error);
				})
			},
			cityUpdata(idx, row) {
				this.isEditCity = true;

				this.cityPriceInfo.id = row.id;
				this.cityPriceInfo.price = row.price;
				this.cityPriceInfo.mileage = row.mileage;
				this.cityPriceInfo.extraPrices = row.extraPrices;

				// this.cityPriceInfo.extraPrices.push({ price: "", mileage: "" });

				this.rowNum = this.cityPriceInfo.extraPrices.length;

				// setTimeout(() => {
				//	 var box = document.querySelectorAll(".cityPriceActionBox"),
				//	 num = this.rowNum;
				//	 box[num - 1].style.display = "block";
				// }, 0);
			},
			changeCityState() {
				// 城市开关
				var _this = this;
				this.$http.get("/changeCityState.shtml", {
					params: {
						id: _this.cityId,
						status: _this.radio ? "VALID" : "INVALID"
					}
				}).then(result => {
					if(result.code == 200) {
						_this.cityInfo.status = _this.radio ? "VALID" : "INVALID";

						sessionStorage.setItem("cityDetail", JSON.stringify(_this.cityInfo));
						_this.$notify({
							title: '成功',
							message: _this.radio ? "城市已打开" : "城市已关闭",
							type: 'success'
						})
					}
				}).catch((error) => {
					console.log(error);
				});
			},
			getCityPriceList() {
				// 初始化同城价格列表
				var _this = this;
				this.$http.get("/cityPriceList.shtml", {
					params: {
						id: _this.cityId
					}
				}).then(result => {
					var arr = [];
					if(result.data.id) {
						arr.push(result.data);
						_this.cityPriceData = arr;
						_this.isAdded = true;
					} else {
						_this.cityPriceData = [];
					}
				}).catch(error => {
					console.log(error);
				})
			},
			cityDel(row) {
				// 删除同城价
				var _this = this;
				var data = "del=" + JSON.stringify({
					cityId: _this.cityId,
					id: row.id
				});

				this.$confirm("确认删除此条记录？", "提示").then(() => {
					_this.loading = true;
					_this.$http.post("/delCityPriceArea.shtml", data).then(result => {
						if(result.code == 200) {
							_this.$notify({
								title: '成功',
								message: "信息删除成功",
								type: 'success'
							})
							_this.getCityPriceList();
						}
						_this.loading = false;
					}).catch(error => {
						console.log(error);
					})
				}).catch(() => {

				});
			},
			addExtraPrice(row) {
				// 增加行 - 超里程价
				if(row.mileageStart != "" && row.mileage != "" && row.price != "") {
					this.cityPriceInfo.extraPrices.push({
						mileage: "",
						price: "",
						mileageStart: row.mileage
					})
				}
			},
			delExtraPrice(row, idx) {
				// 删除行
				var _this = this;
				if(row.id) {
					// 有价格ID
					var data = "id=" + _this.cityId + "&priceId=" + row.id;
					this.$http.post("cityPriceExtraDel", data).then(result => {
						if(result.code == 200) {
							_this.$notify({
								title: '成功',
								message: "价格删除成功",
								type: 'success'
							})
						}
						_this.isEditCity = false;
					}).catch(error => {
						console.log(error);
					})
				} else {
					// 没有价格ID
					this.cityPriceInfo.extraPrices.splice(idx, 1);
				}
			}
		},
		created() {
			var _this = this;
			this.cityInfo = JSON.parse(sessionStorage.getItem("cityDetail"));
			sessionStorage.getItem("tabIdx") ? this.cityDetail = sessionStorage.getItem("tabIdx") : "";

			this.cityName = this.cityInfo.name;
			this.cityId = this.cityInfo.id;
			this.radio = this.cityInfo.status == "VALID" ? true : false;

			this.getCityPriceList();
		}
	}
</script>

<style>

</style>