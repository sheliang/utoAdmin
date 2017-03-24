<template>
	<div class="lineParam">
		<el-form :inline="true" :model="lineParams" ref="lineParams" label-width="120px">
			<el-row>
				<el-form-item label="出发城市" prop="srcCityId">
					<el-select v-model="lineParams.srcCityId" placeholder="请选择出发城市" class="right-gap">
						<el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="目的城市" prop="dstCityId">
					<el-select v-model="lineParams.dstCityId" placeholder="请选择目的城市" class="right-gap">
						<el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="setting" @click="resetForm('lineParams')">重置</el-button>
					<el-button type="primary" icon="search" @click="searchLineInfoClick">查询</el-button>
					<el-button type="primary" icon="plus" @click="addAndReviseLineClick(0,'','lineAddReviseInfo')">添加</el-button>
				</el-form-item>
			</el-row>
		</el-form>
		<el-table :data="lineTableData" border style="width: 100%">
			<el-table-column align='center' prop="id" label="线路id"></el-table-column>
			<el-table-column align='center' prop="srcCity" label="出发城市" width="250"></el-table-column>
			<el-table-column align='center' prop="dstCity" label="目的城市" width="250"></el-table-column>
			<el-table-column align='center' prop="maxReservDay" label="提前下单天数"></el-table-column>
			<el-table-column align='center' prop="minReservMin" label="默认预约时间"></el-table-column>
			<el-table-column align='center' prop="mileage" label="线路标准里程"></el-table-column>
			<el-table-column align='center' prop="" label="线路开关">
				<template scope="props">
					<span>{{props.row.status == "VALID" ? "开" : "关"}}</span>
				</template>
			</el-table-column>
			<el-table-column align='center' label="时段关闭">
				<template scope="scope">
					<el-button @click="timeOffClick(scope.row,'timeOffInfo')" size="small" type="primary">关闭时段</el-button>
				</template>
			</el-table-column>
			<el-table-column align='center' width="280" label="操作">
				<template scope="scope">
					<el-button @click="lineOffClick(scope.row)" size="small" type="primary">
						{{scope.row.status == "VALID" ? "关闭线路" : "开启线路"}}
					</el-button>
					<el-button @click="addAndReviseLineClick(1,scope.row)" size="small" type="primary">修改基础信息</el-button>
					<el-button @click="lineDetails(scope.$index, scope.row)" size="small" type="primary">详情</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination class='pagination' @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="lineParams.pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
		<el-dialog v-model="isAddAndRrviseLine" size='tiny'>
			<span slot="title" class="el-dialog__title">{{lineInfoTitle}}</span>
			<el-form :model="lineAddReviseInfo" label-width="120px" ref="lineAddReviseInfo" :rules="rules1">
				<el-form-item label="出发城市" prop="srcCityId" :rules="[{ required: true, message: '请选择出发城市'}]">
					<el-select v-model="lineAddReviseInfo.srcCityId" placeholder="请选择出发城市">
						<el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="目的城市" prop="dstCityId" :rules="[{ required: true, message: '请选择目的城市'}]">
					<el-select v-model="lineAddReviseInfo.dstCityId" placeholder="请选择目的城市 ">
						<el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="提前下单天数 " prop="maxReservDay" :rules="[{ required: true, message: '请输入提前下单天数'},{ type: 'number',min: 1, message: '下单天数为正数字值'}]">
					<el-input v-model.number="lineAddReviseInfo.maxReservDay" auto-complete="off " style='width: 217px;'></el-input>
				</el-form-item>
				<el-form-item label="默认预约时间 " prop="minReservMin">
					<el-input v-model.number="lineAddReviseInfo.minReservMin" auto-complete="off " style='width: 217px;'></el-input>
					<span class="form-suffix ">分钟</span>
				</el-form-item>
				<el-form-item label="线路标准里程 " prop="mileage" :rules="[{ required: true, message: '请输入线路标准里程'},{ type: 'number',min: 1, message: '线路标准里程为正数字值'}]">
					<el-input v-model.number="lineAddReviseInfo.mileage " style='width: 217px;'></el-input>
					<span class="form-suffix ">公里</span>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer ">
				<el-button @click="resetForm('lineAddReviseInfo')">重置</el-button>
				<el-button @click="isAddAndRrviseLine = false">取 消</el-button>
				<el-button type="primary " @click="addReviseSubmit('lineAddReviseInfo')">提 交</el-button>
			</div>
		</el-dialog>
		<el-dialog v-model="isTimeOff" class='isTimeOff' title="关闭时段" size='tiny'>
			<el-form :inline="true" :model="timeOffInfo" ref="timeOffInfo" label-width="90px">
				<el-row>
					<el-form-item label="线路">
						<span>{{lineCity.srcCity}}</span>
						<span>-</span>
						<span>{{lineCity.dstCity}}</span>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="开始时间" prop="startTimeStr" :rules="[{type: 'date', required: true, message: '请选择开始时间'}]">
						<el-date-picker v-model="timeOffInfo.startTimeStr" format='yyyy-MM-dd HH:mm:ss' type="datetime" placeholder="选择开始时间"></el-date-picker>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="结束时间" prop="endTimeStr" :rules="[{type: 'date', required: true, message: '请选择结束时间'}]">
						<el-date-picker v-model="timeOffInfo.endTimeStr" format='yyyy-MM-dd HH:mm:ss' type="datetime" placeholder="选择结束时间"></el-date-picker>
					</el-form-item>
					<el-button type="primary" icon="" @click="addTimeOffClick()">添加</el-button>
					<el-button type="primary" icon="" @click="resetForm('timeOffInfo')">重置</el-button>
				</el-row>
			</el-form>
			<el-table :data="timeOffData" stripe border style="width: 100%">
				<el-table-column align='center' prop="startTimeStr" label="开始时间"></el-table-column>
				<el-table-column align='center' prop="endTimeStr" label="结束时间"></el-table-column>
				<el-table-column align='center' label="操作">
					<template scope="scope">
						<el-button @click="delTimeOffClick(scope.row)" size="small" type="primary">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination @current-change="handleCurrentChangeTime" :current-page="trafficParams.pageNum" :page-size="trafficParams.pageSize" layout="total, prev, pager, next" :total="totalTime"></el-pagination>
		</el-dialog>
	</div>
</template>
<script>
	export default {
		name: 'lineParam',
		data() {
			var minReservMinRule = (rule, value, callback) => {
				if(!value) {
					return callback(new Error('预约时间不能为空'));
				}
				setTimeout(() => {
					if(!Number.isInteger(value)) {
						callback(new Error('预约时间为数字值'));
					} else {
						if(value % 30 != 0) {
							callback(new Error('预约时间为30的倍数的数字值'));
						} else {
							callback();
						}
					}
				}, 0);
			};
			return {
				total: 0,
				totalTime: 0,
				lineInfoTitle: '',
				isAddLine: true,
				isAddAndRrviseLine: false,
				isTimeOff: false,
				cityList: [],
				lineParams: {
					srcCityId: '',
					dstCityId: '',
					pageNum: 1,
					pageSize: 10
				},
				lineTableData: [],
				lineAddReviseInfo: {
					srcCityId: '',
					dstCityId: '',
					minReservMin: '',
					maxReservDay: '',
					mileage: ''
				},
				lineCity: {
					srcCity: '',
					dstCity: ''
				},
				trafficParams: {
					tripId: '',
					pageNum: 1,
					pageSize: 10
				},
				timeOffInfo: {
					tripId: '',
					startTimeStr: '',
					endTimeStr: ''
				},
				timeOffData: [],
				rules1: {
					minReservMin: [{
						validator: minReservMinRule,
						min: 1,
						required: true,
						trigger: 'change,blur'
					}],
				}
			}
		},
		methods: {
			searchLineInfoClick() {
				var that = this;
				this.$http.post("/lineParamList.shtml",
					"param=" + JSON.stringify(this.lineParams)
				).then(function(data) {
					if(data.code == 200) {
						that.lineTableData = data.data;
						that.total = Number(data.appendix);
					}
				});
			},
			addAndReviseLineClick(val, row, formName) {
				var that = this;
				this.isAddAndRrviseLine = true;
				this.lineAddReviseInfo = {
					srcCityId: '',
					dstCityId: '',
					minReservMin: '',
					maxReservDay: '',
					mileage: ''
				};
				if(val == '0') {
					this.$refs[formName].resetFields();
					this.isAddLine = true;
					this.lineInfoTitle = '添加线路信息';
				} else if(val == '1') {
					this.isAddLine = false;
					this.lineInfoTitle = '修改线路信息';
					this.lineAddReviseInfo = {
						srcCityId: row.srcCityId,
						dstCityId: row.dstCityId,
						minReservMin: row.minReservMin,
						maxReservDay: row.maxReservDay,
						mileage: row.mileage
					};
					this.lineAddReviseInfo.id = row.id;
				}
			},
			addReviseSubmit(formName) {
				var that = this;
				this.$refs[formName].validate((valid) => {
					if(valid) {
						if(this.isAddLine) {
							this.$http.post("/addlineInfo.shtml",
								"param=" + JSON.stringify(this.lineAddReviseInfo)
							).then(function(data) {
								if(data.code == 200) {
									that.searchLineInfoClick();
									that.isAddAndRrviseLine = false;
									that.$notify({
										title: '成功',
										message: '添加成功',
										type: 'success'
									});
								}
							});
						} else {
							this.$http.post("/updatelineInfo.shtml",
								"param=" + JSON.stringify(this.lineAddReviseInfo)
							).then(function(data) {
								if(data.code == 200) {
									that.searchLineInfoClick();
									that.isAddAndRrviseLine = false;
									that.$notify({
										title: '成功',
										message: '修改成功',
										type: 'success'
									});
								}
							});
						}
					} else {
						console.log('error submit!!');
						return false;
					}
				});

			},
			lineOffClick(row) {
				var that = this;
				var statusText;
				if(row.status == 'VALID') {
					statusText = "关闭";
				} else {
					statusText = "开启";
				}
				this.$confirm('确认' + statusText + row.srcCity + '到' + row.dstCity + '线路', '修改线路状态', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					that.$http.get('/updateLineStatus.shtml', {
							params: {
								lineId: row.id,
								status: row.status == "VALID" ? "INVALID" : "VALID"
							}
						})
						.then(function(data) {
							if(data.code == 200) {
								that.searchLineInfoClick();
								that.$message({
									type: 'success',
									message: '修改成功!'
								});
							}
						});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消修改！'
					});
				});
			},
			timeOffClick(row, formName) {
//				this.$refs[formName].resetFields();
				this.isTimeOff = true;
				this.lineCity.srcCity = row.srcCity;
				this.lineCity.dstCity = row.dstCity;
				this.trafficParams.tripId = row.id;
				this.timeOffList();
			},
			timeOffList() {
				var that = this;
				this.$http.post("/lineTrafficList.shtml",
					"param=" + JSON.stringify(this.trafficParams)
				).then(function(data) {
					if(data.code == 200) {
						that.timeOffData = data.data;
						that.totalTime = Number(data.appendix);
					}
				});
			},
			addTimeOffClick(formName) {
				var that = this;
				this.timeOffInfo = {
					tripId: this.trafficParams.tripId,
					startTimeStr: this.dateFormat(new Date(this.timeOffInfo.startTimeStr).getTime(), 'yyyy-MM-dd hh:mm:ss'),
					endTimeStr: this.dateFormat(new Date(this.timeOffInfo.endTimeStr).getTime(), 'yyyy-MM-dd hh:mm:ss')
				};
				this.$http.post("/addLineTraffic.shtml",
					"param=" + JSON.stringify(this.timeOffInfo)
				).then(function(data) {
					if(data.code == 200) {
						that.timeOffList();
						that.$notify({
							title: '成功',
							message: '添加',
							type: 'success'
						});
					}
				});
			},
			delTimeOffClick(row) {
				var that = this;
				this.$confirm('确认删除该时段?', '关闭时段', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$http.get('/delLineTraffic.shtml', {
							params: {
								id: row.controlId
							}
						})
						.then(function(data) {
							if(data.code == 200) {
								that.timeOffList();
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
			lineDetails(index, row) {
				this.$router.push("/line/lineDetail?lineId=" + row.id);
			},
			handleSizeChange(val) {
				this.lineParams.pageSize = val;
				this.searchLineInfoClick();
			},
			handleCurrentChange(val) {
				this.lineParams.pageNum = val;
				this.searchLineInfoClick();
			},
			handleCurrentChangeTime(val) {
				this.trafficParams.pageNum = val;
				this.timeOffList();
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			dateFormat: function(time, fmt) {
				if(!time) {
					return "";
				}
				var d = new Date(time);
				var o = {
					"M+": d.getMonth() + 1, //月份   
					"d+": d.getDate(), //日   
					"h+": d.getHours(), //小时   
					"m+": d.getMinutes(), //分   
					"s+": d.getSeconds(), //秒   
					"q+": Math.floor((d.getMonth() + 3) / 3), //季度   
					"S": d.getMilliseconds() //毫秒   
				};
				if(/(y+)/.test(fmt))
					fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
				for(var k in o)
					if(new RegExp("(" + k + ")").test(fmt))
						fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
				return fmt;
			}

		},
		created() {
			var that = this;
			this.$http.get('/cityList.shtml')
				.then(function(data) {
					that.cityList = data.data;
				});
			this.searchLineInfoClick();
		}
	}
</script>
<style>
	.form-suffix {
		display: inline-block;
		vertical-align: middle;
		font-size: 14px;
		color: #48576a;
		line-height: 1;
		padding: 11px 12px 11px 0;
		box-sizing: border-box;
	}
	
	.pagination {
		padding: 30px 0 0 40px !important;
	}
	
	.isTimeOff .el-pagination {
		margin-top: 10px;
	}
</style>