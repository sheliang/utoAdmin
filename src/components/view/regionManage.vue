<template>
	<div class="region">
		<el-form :inline="true" class="demo-form-inline">
			<span class="right-gap">城市名称 </span>
			<el-select v-model="regionId" placeholder="请选择城市" class="right-gap">
				<el-option v-for="item in cityList" :key="item.cityId" :label="item.text" :value="item.cityId"></el-option>
			</el-select>
			<span class="right-gap">区域名称 </span>
			<el-input v-model="regionName" placeholder="请输入区域名称" class="right-gap" style="display: inline-block;width: 237px;"></el-input>
			<el-form-item>
				<el-button type="primary" icon="search" @click="regionSelect">查询</el-button>
				<el-button type="primary" icon="plus" @click="regionAdd">添加区域</el-button>
			</el-form-item>
		</el-form>

		<el-table :data="regionData" stripe border style="width: 100%">
			<el-table-column prop="regionId" label="区域ID"></el-table-column>
			<el-table-column prop="regionName" label="区域名称"></el-table-column>
			<el-table-column prop="regionJP" label="区域简拼"></el-table-column>
			<el-table-column prop="city" label="所属城市"></el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<el-button type="primary" @click="regionDetail(scope.$index, scope.row)">查看</el-button>
					<el-button type="primary" @click="updateRegionInfo(scope.$index, scope.row)">修改</el-button>
					<el-button type="primary" @click="regionDelete(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-pagination layout="prev, pager, next" :total="1000"></el-pagination>

		<el-dialog v-model="isEdit" :close-on-click-modal="false">
			<el-form :model="regionInfo" label-width="80px" ref="regionInfo">
				<el-form-item label="区域ID" prop="regionId">
					<el-input v-model="regionInfo.regionId" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="区域名称" prop="regionName">
					<el-input v-model="regionInfo.regionName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="区域简拼" prop="regionJP">
					<el-input v-model="regionInfo.regionJP" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="所属城市" prop="city">
					<el-input v-model="regionInfo.city" auto-complete="off"></el-input>
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
				regionName: "",
				regionId: "",
				isEdit: false,
				loading: false,
				isAddRegion: false,
				regionInfo: {
					regionId: "",
					regionName: "",
					regionJP: "",
					city: ""
				},
				cityList:[{
					text: "自贡",
					cityId: 1
				},{
					text: "成都",
					cityId: 2
				},{
					text: "达州",
					cityId: 3
				}],
				regionData: [{
					regionId: 1,
					regionName: "新津",
					regionJP: "xinjin",
					city: "成都"
				},{
					regionId: 1,
					regionName: "一环",
					regionJP: "yihuan",
					city: "成都"
				},{
					regionId: 1,
					regionName: "三环",
					regionJP: "sanhuan",
					city: "成都"
				}]
			}
		},
		methods: {
			// 添加区域
			regionAdd() {
				this.isEdit = true;
				this.isAddRegion = true;
				this.regionInfo.regionId = "";
				this.regionInfo.regionName = "";
				this.regionInfo.regionJP = "";
				this.regionInfo.city = "";
			},
			// 查询区域
			regionSelect() {
				console.log(this.cityId);
			},
			// 点击详情按钮
			regionDetail(idx, row) {
				console.log(row);
			},
			// 点击修改
			updateRegionInfo(idx, row) {
				// console.log(row);
				this.isEdit = true;
				this.isAddRegion = false;
				this.regionInfo.regionId = row.regionId;
				this.regionInfo.regionName = row.regionName;
				this.regionInfo.regionJP = row.regionJP;
				this.regionInfo.city = row.city;
			},
			// 点击关闭按钮
			close(){
				this.isEdit = false;
			},
			// 点击提交按钮
			submit(){
				// console.log(this);
				if(this.isAddCity){
					console.log("现在是添加城市");
				}else{
					console.log("现在是修改基础信息");
				}
			}			
		},
		created() {

		}
	}
</script>

<style>
	.el-table .cell {
		white-space: nowrap !important;
	}
</style>