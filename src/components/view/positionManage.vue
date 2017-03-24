<template>
	<div class="position">
		<el-form :inline="true" class="demo-form-inline">
			<el-row>
				<el-form-item label="城市名称" label-width="120px">
					<el-select v-model="row" placeholder="请选择城市" @change="getbaiduId">
						<el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="定点名称" label-width="120px">
					<el-input v-model="positionName" placeholder="请输入定点名称" class="padding-right-20 w217 inline-input"></el-input>
				</el-form-item>
			</el-row>

			<el-row>
				<el-form-item label="经度" label-width="120px">
					<el-input v-model="lon" placeholder="请输入经度" class="padding-right-20 w217 inline-input"></el-input>
				</el-form-item>
				<el-form-item label="纬度" label-width="120px">
					<el-input v-model="lat" placeholder="请输入纬度" class="padding-right-20 w217 inline-input"></el-input>
				</el-form-item>
			</el-row>

			<el-row>
				<el-form-item label="推荐点" label-width="120px">
					<el-checkbox v-model="groom"></el-checkbox>
				</el-form-item>
			</el-row>

			<el-row>
				<el-form-item class="text-right w800">
					<el-button type="primary" icon="search" @click="getList">查询</el-button>
					<el-button type="primary" icon="plus" @click="positionAdd">添加定点</el-button>
				</el-form-item>
			</el-row>
		</el-form>

		<el-table :data="positionData" stripe border style="width: 100%">
			<el-table-column prop="spotId" label="定点ID" width="80"></el-table-column>
			<el-table-column prop="spotName" label="定点名称" width="120"></el-table-column>
			<el-table-column prop="longtitude" label="经度" width="120"></el-table-column>
			<el-table-column prop="latitude" label="纬度" width="120"></el-table-column>
			<el-table-column prop="cityName" label="所属城市" width="120"></el-table-column>
			<el-table-column prop="type" label="类型" width="150">
				<template scope="props">
					<span>{{props.row.type == "RECOMMEND" ? "推荐点" : "非推荐点"}}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<el-button type="primary" @click="update(scope.row)">修改</el-button>
					<el-button type="danger" @click="deletePosition(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-dialog v-model="isEdit" :close-on-click-modal="false">
			<el-form :model="positionInfo" label-width="80px" ref="positionInfo">
				<!--<el-form-item label="定点ID" prop="spotId">
					<el-input v-model="positionInfo.spotId" auto-complete="off"></el-input>
				</el-form-item>-->
				<el-form-item label="定点名称" prop="spotName">
					<el-input v-model="positionInfo.spotName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="经度" prop="longtitude">
					<el-input v-model="positionInfo.longtitude" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="纬度" prop="latitude">
					<el-input v-model="positionInfo.latitude" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="所属城市" prop="cityName">
					<!-- <el-input v-model="positionInfo.cityName" auto-complete="off"></el-input> -->
					<el-select v-model="rowcityName" placeholder="请选择城市" @change="updateID">
						<el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item"></el-option>
					</el-select>

				</el-form-item>
				<el-form-item label="推荐点" prop="type">
					<el-checkbox v-model="positionInfo.typeNo"></el-checkbox>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="close">取 消</el-button>
				<el-button type="primary" @click.native="submit" :loading="loading">提 交</el-button>
			</div>
		</el-dialog>
		<div class='pagination-box'>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
	      :page-sizes="[10, 20, 30, 40]"
	      :page-size="pageSize"
	      layout="total, sizes, prev, pager, next, jumper"
	      :total="totalPages">
	    </el-pagination>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				cityId: "",
				row: "",
				groom: true,
				isEdit: false,
				loading: false,
				isAddCity:false,
				baiduId:'',
				cityList: [{
					text: "自贡",
					cityId: 1
				}, {
					text: "成都",
					cityId: 2
				}],
				positionName: "",
				lat: "",
				lon: "",
				pageNum: 1,
				pageSize:10,
				totalPages:0,
				positionData: [],
				positionNum:[],
				positionInfo: {
					baiduId: "",
					spotId: "",
					cityId:"",
					spotName: "",
					longtitude: "",
					latitude: "",
					cityName: "",
					type: "",
					typeNo:""
				},
				rowcityName:""
			}
		},
		methods: {
			clearInput(){
						var _this=this;
						_this.baiduId='';
						_this.cityId='';
						_this.positionName='';
						_this.lat='';
						_this.lon='';
						_this.row= ""
			},
			positionAdd() {
				//console.log("添加定点");
				var _this = this;
				var data ="param=" + JSON.stringify({
					baiduId: _this.baiduId,
					cityId:_this.cityId,
					spotName: _this.positionName,
					latitude:_this.lat,
					longtitude:_this.lon,
					type: _this.groom ? "RECOMMEND" : ''
				});
				this.$http.post("/citySpotAdd.shtml", data).then(result => {
					if(result.code == 200){

						_this.$notify({
								title: '成功',
								message: "信息添加成功",
								type: 'success'
						    });
						_this.clearInput();						
						_this.getList();
					}
				}).catch(error => {
					console.log(error);
				})				
			},
			update(row) {
				//console.log("修改");
				var _this=this;
				this.isEdit = true;
				this.loading = false;
				this.positionInfo.baiduId=row.baiduId;
				this.positionInfo.spotId = row.spotId;
				this.positionInfo.spotName = row.spotName;
				this.positionInfo.longtitude = row.longtitude;
				this.positionInfo.latitude = row.latitude;
				this.positionInfo.cityName = row.cityName;
				this.positionInfo.type = row.type;
				this.positionInfo.typeNo = row.type ? true : false;
				this.positionInfo.cityId=row.cityId
				this.rowcityName = row.cityName
			},
			deletePosition(row) {
				//console.log("删除");
				var _this = this;
				var data="param="+JSON.stringify({
							spotId: row.spotId
						})
				this.$confirm("确认删除此条记录？", "提示").then(() => {
					_this.loading = true;
					_this.$http.post("/citySpotDel.shtml",data).then((result) => {
						if(result.code == 200){
							//_this.clearInput();
							_this.getList();
						}
						_this.isEdit = false;
					}).catch((error) => {
						console.log(error);
					});
				}).catch(() => {

				});
			},
			close() {
				this.isEdit = false;
			},
			submit() {
				//console.log("提交");
				// 修改城市基础信息
					var _this = this;
					var data = {
						cityId:_this.positionInfo.cityId,
						baiduId: _this.positionInfo.baiduId,
						spotId: _this.positionInfo.spotId,
						spotName: _this.positionInfo.spotName,
						latitude:_this.positionInfo.latitude,
						longtitude:_this.positionInfo.longtitude,
						type: _this.positionInfo.typeNo ? _this.positionInfo.type : ''
					}
					this.$http.post("/citySpotUpdate.shtml", "param=" + JSON.stringify(data)).then((result) => {
						if(result.code == 200){
							_this.$notify({
								title: '成功',
								message: "信息修改成功",
								type: 'success'
							});
							_this.getList();
						}
						_this.isEdit = false;
					}).catch((error) => {
						console.log(error);
					});
			},
			getbaiduId(key) {
				this.baiduId=key.baiduId;
				this.cityId=key.id;
			},
			updateID(key) {
				this.positionInfo.baiduId=key.baiduId;
				this.positionInfo.cityId=key.id
			},
			getList() {
				var _this = this;
				var data ="param=" + JSON.stringify({
					pageSize: '',
					pageNum: 1,
					spotName: _this.positionName,
					cityId: _this.cityId
				});
				this.$http.post("/citySpot.shtml", data).then(result => {
					if(result.code == 200){
						_this.positionNum = result.data;
						_this.totalPages=result.data.length;
						_this.positionData=_this.positionNum.slice((_this.pageNum-1)*_this.pageSize,_this.pageSize*_this.pageNum)
					}

				}).catch(error => {
					console.log(error);
				})
			},
			handleSizeChange(val) {
				this.pageSize=val;
				this.getList()
	      	},
	      	handleCurrentChange(val) {
				this.pageNum = val;
				this.getList()
	      	}
		},
		created() {
			var _this = this;
			this.$http.post("/cityList.shtml", "value=" + JSON.stringify({
					name: "",
					pageNum: 1,
					pageSize: 1000
				})).then((result) => {
					if (result.code == 200) {
						_this.cityList = result.data;
						_this.getList();						
					}
				}).catch((error) => {
					console.log(error);
				});
		}
	}
</script>

<style>
	.label-width {
		display: inline-block;
		width: 100px;
	}
	
	.padding-left-50 {
		padding-left: 50px;
	}
	.pagination-box{
		padding-top:30px; 
		padding-left: 40px;
	}
</style>