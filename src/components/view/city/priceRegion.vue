<template>
	<div class="regionPrice">
		<el-breadcrumb separator=">">
			<el-breadcrumb-item :to="{ path: '/city/home'}">城市管理</el-breadcrumb-item>
			<el-breadcrumb-item>城市参数</el-breadcrumb-item>
			<el-breadcrumb-item>{{cityName}}</el-breadcrumb-item>
		</el-breadcrumb>

		<el-form :inline="true" class="br">
			<el-row>
				<el-form-item label="开始时间">
					<el-date-picker v-model="startTime" type="datetime" placeholder="选择开始时间"></el-date-picker>
				</el-form-item>

				<el-form-item label="结束时间" label-width="120px">
					<el-date-picker v-model="endTime" type="datetime" placeholder="选择结束时间"></el-date-picker>
				</el-form-item>
			</el-row>

			<el-row>
				<el-form-item label="调价类型">
					<div class="w193">
						<el-radio class="radio" v-model="priceType" label="PERCENTAGE">百分比</el-radio>
						<el-radio class="radio" v-model="priceType" label="PRICE">金额</el-radio>
					</div>
				</el-form-item>

				<el-form-item label="价格" label-width="120px">
					<el-input v-model="changePrice" placeholder="请输入价格" class="inline-input w217"></el-input>
				</el-form-item>
			</el-row>

			<el-row>
				<el-form-item label="调价区域"></el-form-item>
			</el-row>

			<el-row>
				<el-form-item :label="cityName">
					<el-select v-model="county" filterable placeholder="请选择" @change="areaSelected">
						<el-option v-for="(item, $index) in countyList" :key="item.pinyin" :label="item.name" :value="item"></el-option>
					</el-select>

					<el-button type="primary" @click.native="regionAdd">添加调价区域</el-button>
				</el-form-item>
			</el-row>

			<el-row>
				<el-form-item class="w800 text-right">
					<el-button type="primary" icon="plus" @click.native="regionPriceAdd">添加</el-button>
				</el-form-item>
			</el-row>
		</el-form>

		<el-table :data="regionPriceData" stripe border fit style="width: 100%;" class="br">
			<el-table-column prop="startTime" label="开始时间"></el-table-column>
			<el-table-column prop="endTime" label="结束时间"></el-table-column>
			<el-table-column prop="regionPrice" label="调价区域"></el-table-column>
			<el-table-column prop="price" label="价格"></el-table-column>
			<el-table-column label="排序">
				<template scope="scope">
					<span>asdf</span>
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<el-button type="primary" icon="edit">修改</el-button>
					<el-button type="danger" icon="delete">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-dialog v-model="isEdit" :close-on-click-modal="false">
			<el-form :model="regionInfo" label-width="80px" ref="regionInfo">
				<el-form-item label="区域名称" prop="name">
					<el-input v-model="regionInfo.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="区域简拼" prop="pinyin">
					<el-input v-model="regionInfo.pinyin" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="区域范围" prop="points">
					<baiduMap :cityName="cityName" :regionInfo="regionInfo" :isEdit="isEdit" @message="getPoints"></baiduMap>
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
				// 调价区
				areaPinyin: "",
				cityName: "",
				areaName: "",
				startTime: "",
				endTime: "",
				priceType: "PRICE",
				changePrice: "",
				county: "",
				countyList: [],
				regionPriceData: [],
				isEdit: false,
				loading: false,
				regionInfo: {
					name: "",
					baiduId: "",
					pinyin: "",
					points: []
				},
				points: []
			}
		},
		components: {
			baiduMap: require("../sub/baiduMap.vue")
		},
		methods: {
			// 调价区域
			regionPriceAdd() {
				// 添加调价区域
				var _this = this;

				var data = JSON.stringify({
					cityId: _this.cityId,
					pinyin: _this.areaPinyin,
					startTime: new Date(_this.startTime).getTime(),
					endTime: new Date(_this.endTime).getTime(),
					ruleType: _this.priceType,
					adjust: _this.changePrice
				})

				this.$http.post("/addCityPriceArea.shtml", "add=" + data).then(result => {
					if(result.code == 200) {
						_this.getListCityArea();
					}
				}).catch(error => {
					console.log(error);
				})
			},
			regionAdd() {
				this.isEdit = true;
				this.isAdd = true;
				this.isManage = false;

				this.regionInfo.name = "";
				this.regionInfo.pinyin = "";
				this.regionInfo.points = "";
			},
			close() {
				this.isEdit = false;
			},
			submit() {
				var _this = this;
				console.log(1);
			},
			getListCityArea() {
				// 同城调价区域列表
				var _this = this;

				this.$http.get("/listCityArea.shtml", {
					params: {
						cityId: _this.cityId
					}
				}).then(result => {
					if(result.code == 200) {
						_this.regionPriceData = result.data;
					}
				}).catch(error => {
					console.log(error);
				})
			},
			getListArea() {
				// 同城区域列表
				var _this = this;
				var data = "pageNum=1&pageSize=1000" + "&param=" + JSON.stringify({
					cityId: _this.cityId,
					name: ""
				});
				this.$http.post("/cityPriceAdjustList.shtml", data).then(result => {
					if(result.code == 200) {
						_this.countyList = result.data;
					}
				}).catch(error => {
					console.log(error);
				})
			},
			areaSelected(idx) {
				this.areaPinyin = idx.pinyin;
				this.areaName = idx.areaName;
			},
			getPoints(points){
				this.points = points;
			}
		},
		created() {
			var _this = this;
			this.cityInfo = JSON.parse(sessionStorage.getItem("cityDetail"));
			sessionStorage.getItem("tabIdx") ? this.cityDetail = sessionStorage.getItem("tabIdx") : "";

			this.cityName = this.cityInfo.name;
			this.cityId = this.cityInfo.id;
			this.radio = this.cityInfo.status == "VALID" ? true : false;

			this.getListCityArea();
			this.getListArea();
		}
	}
</script>

<style>

</style>