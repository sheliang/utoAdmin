<template>
	<div class="home">
		<el-form :inline="true" class="demo-form-inline">
			<label class="right-gap">城市名称 </label>
			<el-select v-model="cityId" placeholder="请选择城市" class="right-gap">
				<el-option v-for="item in cityList" :key="item.cityId" :label="item.text" :value="item.cityId"></el-option>
			</el-select>
			<el-form-item>
				<el-button type="primary" icon="search" @click="citySelect">查询</el-button>
				<el-button type="primary" icon="plus" @click="cityAdd">添加</el-button>
			</el-form-item>
		</el-form>

		<el-table :data="cityData" stripe border style="width: 100%">
			<el-table-column prop="cityId" label="城市ID" width="80"></el-table-column>
			<el-table-column prop="baiduId" label="百度ID" width="80"></el-table-column>
			<el-table-column prop="cityName" label="城市名称" width="120"></el-table-column>
			<el-table-column prop="jp" label="简拼" width="120"></el-table-column>
			<el-table-column prop="lat" label="城市经度" width="120"></el-table-column>
			<el-table-column prop="lon" label="城市纬度" width="120"></el-table-column>
			<el-table-column prop="cityState" label="同城开关状态" width="150"></el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<el-button type="primary" @click="updateCityInfo(scope.$index, scope.row)">修改基础信息</el-button>
					<el-button type="primary" @click="cityDetail(scope.$index, scope.row)">详情</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-pagination layout="prev, pager, next" :total="1000"></el-pagination>

		<el-dialog v-model="isEdit" :close-on-click-modal="false">
			<el-form :model="cityInfo" label-width="80px" ref="cityInfo">
				<el-form-item label="城市ID" prop="cityId">
					<el-input v-model="cityInfo.cityId" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="百度ID" prop="baiduId">
					<el-input v-model="cityInfo.baiduId" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="城市名称" prop="cityName">
					<el-input v-model="cityInfo.cityName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="简拼" prop="jp">
					<el-input v-model="cityInfo.jp" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="城市经度" prop="lon">
					<el-input v-model="cityInfo.lon" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="城市纬度" prop="lat">
					<el-input v-model="cityInfo.lat" auto-complete="off"></el-input>
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
				cityInfo: {
					cityId: "",
					baiduId: "",
					cityName: "",
					jp: "",
					lon: "",
					lat: ""
				},
				cityList: [{
					text: "自贡",
					cityId: 1
				}, {
					text: "成都",
					cityId: 2
				}, {
					text: "达州",
					cityId: 3
				}],
				cityData: [{
					cityId: 1,
					baiduId: 1,
					cityName: "成都",
					jp: "chengdu",
					lat: "29.460198",
					lon: "104.437143",
					cityState: "开启"
				}, {
					cityId: 1,
					baiduId: 1,
					cityName: "成都",
					jp: "chengdu",
					lat: "29.460198",
					lon: "104.437143",
					cityState: "关闭"
				}, {
					cityId: 1,
					baiduId: 1,
					cityName: "成都",
					jp: "chengdu",
					lat: "29.460198",
					lon: "104.437143",
					cityState: "开启"
				}]
			}
		},
		methods: {
			// 添加城市
			cityAdd() {
				this.isEdit = true;
				this.isAddCity = true;
				this.cityInfo.cityId = "";
				this.cityInfo.baiduId = "";
				this.cityInfo.cityName = this.cityName;
				this.cityInfo.jp = "";
				this.cityInfo.lon = "";
				this.cityInfo.lat = "";
			},
			// 查询城市
			citySelect() {
				console.log(this.cityId);
			},
			// 点击详情按钮
			cityDetail(idx, row) {
				console.log(row);
				this.$router.push("/detail?cityName=" + row.cityName + "&cityId=" + row.cityId);
			},
			// 点击修改基础信息
			updateCityInfo(idx, row) {
				this.isEdit = true;
				this.isAddCity = false;
				this.cityInfo.cityId = row.cityId;
				this.cityInfo.baiduId = row.baiduId;
				this.cityInfo.cityName = row.cityName;
				this.cityInfo.jp = row.cityId;
				this.cityInfo.lon = row.lon;
				this.cityInfo.lat = row.lat;
			},
			// 点击关闭按钮
			close() {
				this.isEdit = false;
			},
			// 点击提交按钮
			submit() {
				// console.log(this);
				if(this.isAddCity) {
					console.log("现在是添加城市");
				} else {
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
	
	.right-gap {
		margin-right: 10px;
	}
</style>