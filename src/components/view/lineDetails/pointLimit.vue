<template>
	<div class="pointLimit">
		<el-form :inline="true" :model="form" label-width="120px">
			<el-row>
				<el-form-item label="线路">
					<span>成都</span>
					<span>-</span>
					<span>自贡</span>
				</el-form-item>
			</el-row>
			<el-row>
				<el-col>
					<span class="fixed-position">定点选择（可多选）：</span>
				</el-col>
				<el-col>
					<span class="fixed-position"><span>自贡</span></span>
					<el-checkbox-group v-model="checkList">
						<el-checkbox label="恐龙博物馆1"></el-checkbox>
						<el-checkbox label="恐龙博物馆2"></el-checkbox>
						<el-checkbox label="恐龙博物馆3"></el-checkbox>
					</el-checkbox-group>
				</el-col>
			</el-row>
			<el-row>
				<el-form-item label="限制类型">
					 <el-radio class="radio" v-model="radio" label="1">按时间限制</el-radio>
				</el-form-item>
			</el-row>
			<el-row>
				<el-form-item label="开始时间">
					<div>
						<el-date-picker v-model="value1" type="date" placeholder="选择日期" :picker-options="pickerOptions0"></el-date-picker>
					</div>
				</el-form-item>
				<el-form-item label="结束时间">
					<div>
						<el-date-picker v-model="value1" type="date" placeholder="选择日期" :picker-options="pickerOptions0"></el-date-picker>
					</div>
				</el-form-item>
				<el-button type="primary">返回</el-button>
				<el-button type="primary" icon="plus" @click="add">添加</el-button>
			</el-row>
		</el-form>
		<el-table :data="PLTableData" stripe border style="width: 100%">
			<el-table-column align='center' prop="name" label="定点名称"></el-table-column>
			<el-table-column align='center' prop="cityId" label="所属城市"></el-table-column>
			<el-table-column align='center' prop="ruleType" label="限制类型"></el-table-column>
			<el-table-column align='center' prop="startTime" label="开始时间"></el-table-column>
			<el-table-column align='center' prop="endTime" label="结束时间"></el-table-column>
			<el-table-column align='center' label="操作">
				<template scope="scope">
					<el-button @click="del" size="small" type="primary">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination class='pagination' @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
		
	</div>
</template>
<script>
	export default {
		name: 'pointLimit',
		data() {
			return {
				currentPage4: 4,
				total: 200,
				checkList: ['恐龙博物馆1'],
				radio: '1',
				value1: '',
				form: {
					srcCity: '',
					dstCity: '',
					region: '',
					name: ''
				},
				pickerOptions0: {
					disabledDate(time) {
						return time.getTime() < Date.now() - 8.64e7;
					}
				},
				PLTableData: [{
					name: '4545',
					cityId: '30',
					ruleType: '3',
					startTime:'2015-4-9',
					endTime:'2016-9-8'
				}],
				
			}
		},
		methods: {
			search() {
				console.log('submit!');
			},
			add() {

			},
			handleClick() {

			},
			revise() {
				this.isReviseDC = true;
			},
			del() {

			},
			handleSizeChange(val) {
				console.log('每页 ${val} 条');
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				console.log('当前页: ${val}');
			}
		}
	}
</script>
<style>
.fixed-position{
	width: 180px;
	display: inline-block;
	text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #48576a;
    line-height: 1;
    padding-right: 12px;
    padding-top: 2px;
    box-sizing: border-box;
    margin-bottom: 22px;
}
	.pagination {
		padding: 30px 0 0 40px !important;
	}
</style>