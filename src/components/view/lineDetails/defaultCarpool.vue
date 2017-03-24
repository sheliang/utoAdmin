<template>
	<div class="lineDefaultCarpool">
		<el-form :inline="true" :model="lineParams" ref="lineParams" label-width="130px">
			<el-row>
				<el-form-item label="线路">
					<span>成都</span>
					<span>-</span>
					<span>自贡</span>
				</el-form-item>
			</el-row>
			<el-row>
				<el-form-item label="车型" prop="carModelId" :rules="[{ required: true, message: '请选择车型'}]">
					<el-select v-model="lineParams.carModelId" placeholder="请选择车型">
						<el-option v-for="item in allModelList" :key="item.carTypeId" :label="item.typeName" :value="item.carTypeId"></el-option>
					</el-select>
				</el-form-item>
			</el-row>
			<el-row>
				<el-form-item label="拼车起步价" prop="price" :rules="[{ required: true, message: '请输入拼车起步价'},{min: 1, message: '拼车起步价为正数字值'}]">
					<el-input v-model="lineParams.price" auto-complete="off " style='width: 217px;'></el-input>
					<span>元</span>
				</el-form-item>
				<el-form-item label="拼车包含公里数" prop="mileage" :rules="[{ required: true, message: '请输入拼车包含公里数'},{ min: 0, message: '包含公里数为大于0的数值'}]">
					<el-input v-model="lineParams.mileage" auto-complete="off " style='width: 217px;'></el-input>
					<span>公里</span>
				</el-form-item>
				<el-form-item label="">
					<el-button type="primary" icon="setting" @click="resetForm('lineParams')">重置</el-button>
					<el-button type="primary" icon="plus" @click="addDefaultClick">添加</el-button>
				</el-form-item>
			</el-row>
		</el-form>
		<el-table :data="DCTableData" border style="width: 100%">
			<el-table-column align='center' prop="typeName" label="车型"></el-table-column>
			<el-table-column align='center' prop="price" label="拼车起步价"></el-table-column>
			<el-table-column align='center' prop="mileage" label="起步公里数"></el-table-column>
			<el-table-column align='center' label="超里程价" width="400">
				<template scope="scope">
					<el-table :data="scope.row.extraPrices">
						<el-table-column align='center' prop="id" label="适用公里数" width="250">
							<template scope="props">
								<span>{{props.row.mileageStart}} —— {{props.row.mileage}} 公里</span>
							</template>
						</el-table-column>
						<el-table-column align='center' prop="price" label="单价" width="100"></el-table-column>
						<el-table-column align='center' label="" width="52">
							<template scope="r">
								<el-button v-if="r.$index == (scope.row.extraPrices.length - 2)" @click="delExtraPrice(r.$index, r.row)" size="small" type="primary">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</template>
			</el-table-column>
			<el-table-column align='center' label="操作">
				<template scope="scope">
					<el-button @click="revisePrice(scope.row)" size="small" type="primary">修改</el-button>
					<el-button @click="delDefault(scope.$index, scope.row)" size="small" type="primary">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--<el-pagination class='pagination' @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>-->
		<el-dialog v-model="isReviseDC" title="修改默认拼车价" size='small'>
			<el-form :model="reviseDCInfo" label-width="100px" ref="cityPriceInfo">
				<el-form-item label="车型" prop="carModelId" :rules="[{ required: true, message: '请选择车型'}]">
					<el-select v-model="reviseDCInfo.carModelId" placeholder="请选择车型">
						<el-option v-for="item in allModelList" :key="item.carTypeId" :label="item.typeName" :value="item.carTypeId"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="起步价" prop="price" :rules="[{ required: true, message: '请输入起步价'},{ type: 'number',min: 0, message: '起步价为数字值'}]">
					<el-input v-model="reviseDCInfo.price" style='width: 217px;'></el-input>
				</el-form-item>
				<el-form-item label="起步公里数" prop="mileage" :rules="[{ required: true, message: '请输入起步公里数'},{ type: 'number',min: 1, message: '起步公里数为数字值'}]">
					<el-input v-model="reviseDCInfo.mileage" style='width: 217px;'></el-input>
				</el-form-item>
				<el-form-item label="超里程价" prop="extraPrices">
					<el-table :data="reviseDCInfo.extraPrices" border style="width: 100%;">
						<el-table-column align='center' prop="price" label="适用公里数(公里)" width="240">
							<template scope="scope">
								<el-input :disabled="true" v-model="scope.row.mileageStart" class="price-input"></el-input>
								——
								<el-input :disabled="(scope.$index + 1) < reviseDCInfo.extraPrices.length" v-model="scope.row.mileage" @blur='ruleMileageSize' class="price-input"></el-input>
							</template>
						</el-table-column>
						<el-table-column align='center' label="单价(元)">
							<template scope="scope">
								<el-input v-model="scope.row.price" class="price-input"></el-input>
							</template>
						</el-table-column>
						<el-table-column align='center' label="操作">
							<template scope="scope">
								<el-button v-if="(scope.$index + 1) == reviseDCInfo.extraPrices.length" @click="addExtraPrice(scope.row)" size="small" type="primary">添加</el-button>
								<el-button v-if="scope.$index == (reviseDCInfo.extraPrices.length-2)" @click="delExtraPrice(scope.$index, scope.row)" size="small" type="primary">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="isReviseDC=false">取 消</el-button>
				<el-button type="primary" @click="updateDefaultPrice">提 交</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	export default {
		name: 'lineDefaultCarpool',
		data() {
			return {
				lineId: '',
				allModelList: [],
				isReviseDC: false,
				lineParams: {
					carModelId: '',
					price: '',
					mileage: ''
				},
				DCTableData: [],
				reviseDCInfo: {
					id: '',
					carModelId: '',
					price: '',
					mileage: '',
					extraPrices: [{
						id: '',
						mileageStart: '',
						mileage: '',
						price: ''
					}]
				}
			}
		},
		methods: {
			searchList() {
				var that = this;
				this.$http.get('/lineDefaultShareList.shtml', {
						params: {
							lineId: this.lineId
						}
					})
					.then(function(data) {
						if(data.code == 200) {
							that.DCTableData = data.data;
						}
					});
			},
			addDefaultClick() {
				var that = this;
				this.lineParams.id = this.lineId;
				this.$http.post("/addDefaultShare.shtml",
					"param=" + JSON.stringify(this.lineParams)
				).then(function(data) {
					if(data.code == 200) {
						that.searchList();
						that.$notify({
							title: '成功',
							message: '添加成功',
							type: 'success'
						});
					}
				});
			},
			delDefault(index, row) {
				var that = this;
				this.$confirm('确认删除该车型的价格配置信息?', '删除车型价格配置信息', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var priceId = {
						id: row.id
					};
					this.$http.post("/delDefaultShare.shtml",
						"param=" + JSON.stringify(priceId)
					).then(function(data) {
						if(data.code == 200) {
							that.searchList();
							that.$message({
								type: 'success',
								message: '删除成功!'
							});
						}
					});

				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});

			},
			revisePrice(row) {
				this.isReviseDC = true;
				this.reviseDCInfo = JSON.parse(JSON.stringify(row));
				var extraPrice = this.reviseDCInfo.extraPrices;
				if(extraPrice[extraPrice.length - 1].mileage == "9999999") {
					extraPrice[extraPrice.length - 1].mileage = "";
				}
				if(extraPrice[extraPrice.length - 1].price == "0") {
					extraPrice[extraPrice.length - 1].price = "";
				}
			},
			delExtraPrice(index, row) {
				var that = this;
				this.$confirm('确认删除该超里程价格配置信息?', '删除超里程价信息', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var priceId = {
						id: row.id
					};
					this.$http.post("/delExtraPriceShare.shtml",
						"param=" + JSON.stringify(priceId)
					).then(function(data) {
						if(data.code == 200) {
							that.searchList();
							that.isReviseDC = false;
							that.$message({
								type: 'success',
								message: '删除成功!'
							});
						}
					});

				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});

			},
			addExtraPrice(row) {
				if(row.mileageStart != '' && row.mileage != '' && row.price != '') {
					this.reviseDCInfo.extraPrices.push({
						id: '',
						mileage: '',
						price: '',
						mileageStart: row.mileage
					})
				}
			},
			updateDefaultPrice() {
				var that = this;
				var params = this.reviseDCInfo;
				params.lineId = this.lineId;
				this.$http.post("/updateDefaultShare.shtml",
					"param=" + JSON.stringify(params)
				).then(function(data) {
					if(data.code == 200) {
						that.searchList();
						that.isReviseDC = false;
						that.$notify({
							title: '成功',
							message: '添加成功',
							type: 'success'
						});
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			ruleMileageSize() {
				var arry = this.reviseDCInfo.extraPrices;
				if(arry[arry.length-1].mileage && arry[arry.length-1].mileage <= arry[arry.length-1].mileageStart){
					this.$message.error('结束公里数必须大于开始公里数');
				}
			}
		},
		created() {
			this.lineId = window.location.href.split('=')[1];
			var that = this;
			this.$http.get('/allModelList.shtml')
				.then(function(data) {
					if(data.code == 200) {
						that.allModelList = data.data;
					}
					that.searchList();
				});
		}
	}
</script>
<style>
	.pagination {
		padding: 30px 0 0 40px !important;
	}
	
	.lineDefaultCarpool .el-table .cell {
		padding: 0 !important;
	}
</style>