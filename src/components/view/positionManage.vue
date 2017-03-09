<template>
	<div class="position">
		<span class="right-gap label-width">城市名称</span>
		<el-select v-model="cityId" placeholder="请选择城市" class="right-gap">
			<el-option v-for="item in cityList" :key="item.cityId" :label="item.text" :value="item.cityId"></el-option>
		</el-select>
		<span class="right-gap label-width">定点名称 </span>
		<el-input v-model="positionName" placeholder="请输入定点名称" class="right-gap" style="display: inline-block;width: 217px;"></el-input>
		<br /><br />
		<span class="right-gap label-width">经度 </span>
		<el-input v-model="lon" placeholder="请输入经度" class="right-gap" style="display: inline-block;width: 217px;"></el-input>
		<span class="right-gap label-width">纬度 </span>
		<el-input v-model="lat" placeholder="请输入纬度" class="right-gap" style="display: inline-block;width: 217px;"></el-input>
		<br /><br />
		<el-checkbox v-model="groom">推荐点</el-checkbox>

		<div class="text-right w1000">
			<el-button type="primary" icon="search" @click="positionSelect">查询</el-button>
			<el-button type="primary" icon="plus" @click="positionAdd">添加定点</el-button>
		</div>
		<br />
		<el-table :data="positionData" stripe border style="width: 100%">
			<el-table-column prop="positionId" label="定点ID" width="80"></el-table-column>
			<el-table-column prop="positionName" label="定点名称" width="120"></el-table-column>
			<el-table-column prop="lat" label="经度" width="120"></el-table-column>
			<el-table-column prop="lon" label="纬度" width="120"></el-table-column>
			<el-table-column prop="city" label="所属城市" width="120"></el-table-column>
			<el-table-column prop="type" label="类型" width="150"></el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<el-button type="primary" @click="update(scope.row)">修改</el-button>
					<el-button type="primary" @click="deletePosition(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		
		<el-dialog v-model="isEdit" :close-on-click-modal="false">
			<el-form :model="positionInfo" label-width="80px" ref="positionInfo">
				<el-form-item label="定点ID" prop="positionId">
					<el-input v-model="positionInfo.positionId" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="定点名称" prop="positionName">
					<el-input v-model="positionInfo.positionName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="经度" prop="lon">
					<el-input v-model="positionInfo.lon" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="纬度" prop="lat">
					<el-input v-model="positionInfo.lat" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="所属城市" prop="city">
					<el-input v-model="positionInfo.city" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="类型" prop="type">
					<el-input v-model="positionInfo.type" auto-complete="off"></el-input>
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
		data() {
			return {
				cityId: "",
				groom: true,
				isEdit: false,
				loading: false,
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
				positionData: [{
					positionId: 11,
					positionName: "四川理工",
					lat: 104.000,
					lon: 29.000,
					city: "自贡",
					type: "推荐点"
				}],
				positionInfo: {
					positionId: "",
					positionName: "",
					lon: "",
					lat: "",
					city: "",
					type: ""
				}
			}
		},
		methods: {
			positionSelect(){
				console.log("查询");
			},
			positionAdd(){
				console.log("添加定点");
			},
			update(row){
				// console.log("修改");
				this.isEdit = true;
				
				this.positionInfo.positionId = row.positionId;
				this.positionInfo.positionName = row.positionName;
				this.positionInfo.lon = row.lon;
				this.positionInfo.lat = row.lat;
				this.positionInfo.city = row.city;
				this.positionInfo.type = row.type;
			},
			deletePosition(){
				console.log("删除");
			},
			close(){
				this.isEdit = false;
			},
			submit(){
				console.log("提交");
				
			}
		}
	}
</script>

<style>
	.label-width {
		display: inline-block;
		width: 100px;
	}
</style>