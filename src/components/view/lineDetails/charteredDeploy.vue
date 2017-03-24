<template>
	<div class="lineCarpoolDeploy">
		<el-form :inline="true" :model="form" label-width="120px">
			<el-row>
				<el-form-item label="线路">
					<span>成都</span>
					<span>-</span>
					<span>自贡</span>
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
			</el-row>
			<el-row>
				<el-form-item label="间隔时间">
					<div>
						<el-date-picker v-model="value1" type="date" placeholder="选择日期" :picker-options="pickerOptions0"></el-date-picker>
						<span>分钟</span>
					</div>
				</el-form-item>
				<el-form-item label="预约时间">
					<div>
						<el-date-picker v-model="value1" type="date" placeholder="选择日期" :picker-options="pickerOptions0"></el-date-picker>
						<span>分钟</span>
					</div>
				</el-form-item>
				<el-button type="primary">返回</el-button>
				<el-button type="primary" icon="plus" @click="add">添加</el-button>
			</el-row>
		</el-form>
		<el-table :data="DCTableData" stripe border style="width: 100%">
			<el-table-column align='center' prop="carModelId" label="开始时间"></el-table-column>
			<el-table-column align='center' prop="price" label="结束时间"></el-table-column>
			<el-table-column align='center' prop="mileage" label="间隔时间"></el-table-column>
			<el-table-column align='center' prop="price" label="预约时间"></el-table-column>
			<el-table-column align='center' prop="mileage" label="车型价格">
				<template scope="scope">
					<el-button @click="models" size="small" type="primary">车型</el-button>
				</template>
			</el-table-column>
			<el-table-column align='center' label="操作">
				<template scope="scope">
					<el-button @click="reviseCD" size="small" type="primary">修改</el-button>
					<el-button @click="del" size="small" type="primary">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination class='pagination' @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
		<el-dialog v-model="isReviseCD" title="修改包车配置" size='tiny'>
			<el-form label-width="120px">
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

				<el-form-item label="间隔时间">
					<div>
						<el-date-picker v-model="value1" type="date" placeholder="选择日期" :picker-options="pickerOptions0"></el-date-picker>
						<span>分钟</span>
					</div>
				</el-form-item>
				<el-form-item label="预约时间">
					<div>
						<el-date-picker v-model="value1" type="date" placeholder="选择日期" :picker-options="pickerOptions0"></el-date-picker>
						<span>分钟</span>
					</div>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer ">
				<el-button @click.native="close ">取 消</el-button>
				<el-button type="primary " @click.native="submit ">提 交</el-button>
			</div>
		</el-dialog>
		<el-dialog v-model="isReviseModelsPrice" title="修改车型价格" size='large'>
			<el-form :inline="true" :model="form" label-width="120px">
				<el-row>
					<el-form-item label="线路">
						<span>成都</span>
						<span>-</span>
						<span>自贡</span>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="开始时间">2016-04-05</el-form-item>
					<el-form-item label="结束时间">2016-04-05</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="车型">
						<el-select v-model="form.region" placeholder="请选择车型">
							<el-option label="区域一" value="shanghai"></el-option>
							<el-option label="区域二" value="beijing"></el-option>
						</el-select>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="包车起步价">
						<el-input v-model="form.name" style='width: 217px;'></el-input>
						<span>元</span>
					</el-form-item>
					<el-form-item label="包车包含公里数">
						<el-input v-model="form.name" style='width: 217px;'></el-input>
						<span>公里</span>
					</el-form-item>
					<el-button type="primary">返回</el-button>
					<el-button type="primary" icon="plus" @click="add">添加</el-button>
				</el-row>
			</el-form>
			<el-table :data="DCTableData" stripe border style="width: 100%">
				<el-table-column align='center' prop="carModelId" label="车型"></el-table-column>
				<el-table-column align='center' prop="price" label="包车起步价"></el-table-column>
				<el-table-column align='center' prop="mileage" label="起步公里数"></el-table-column>
				<el-table-column align='center' prop="extraPrices.id" label="超里程价">
					<el-table-column align='center' label="适用公里数">
						<template scope="scope">
							<span>{{scope.row.extraPrices.mileage}} — {{scope.row.extraPrices.mileage}}</span>
						</template>
					</el-table-column>
					<el-table-column align='center' prop="extraPrices.price" label="单价"></el-table-column>
				</el-table-column>
				<el-table-column align='center' label="操作">
					<template scope="scope">
						<el-button @click="revise" size="small" type="primary">修改</el-button>
						<el-button @click="del" size="small" type="primary">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination class='pagination' @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
		</el-dialog>
		<el-dialog v-model="isReviseDC" title="修改默认包车价" size='small'>
			<el-form :model="reviseDCInfo" label-width="100px" ref="cityPriceInfo">
				<el-form-item label="车型">
					<el-select v-model="reviseDCInfo.carModelId" placeholder="请选择车型">
						<el-option label="区域一" value="shanghai"></el-option>
						<el-option label="区域二" value="beijing"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="起步价" prop="price">
					<el-input v-model="reviseDCInfo.price" auto-complete="off" style='width: 217px;'></el-input>
				</el-form-item>
				<el-form-item label="起步公里数" prop="mileage">
					<el-input v-model="reviseDCInfo.mileage" auto-complete="off" style='width: 217px;'></el-input>
				</el-form-item>
				<el-form-item label="超里程价" prop="extraPrices">
					<el-table :data="reviseDCInfo.extraPrices" stripe border style="width: 100%;">
						<el-table-column align='center' prop="price" label="适用公里数(公里)" width="240">
							<template scope="scope">
								<el-input v-model="scope.row.mileage" class="price-input"></el-input>
								——
								<el-input class="price-input"></el-input>
							</template>
						</el-table-column>
						<el-table-column align='center' label="单价(元)">
							<template scope="scope">
								<el-input v-model="scope.row.price" class="price-input"></el-input>
							</template>
						</el-table-column>
						<el-table-column align='center' label="操作">
							<template scope="scope">
								<el-button @click="" size="small" type="primary">修改</el-button>
								<el-button @click="" size="small" type="primary">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="closeCity">取 消</el-button>
				<el-button type="primary" @click.native="submitCity">提 交</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	export default {
		name: 'lineCarpoolDeploy',
		data() {
			return {
				value1: '',
				pickerOptions0: {
					disabledDate(time) {
						return time.getTime() < Date.now() - 8.64e7;
					}
				},
				currentPage4: 4,
				total: 200,
				isReviseDC: false,
				isReviseCD: false,
				isReviseModelsPrice:false,
				form: {
					srcCity: '',
					dstCity: '',
					region: '',
					name: ''
				},
				DCTableData: [{
					carModelId: '4545',
					price: '30',
					mileage: '3',
					extraPrices: {
						id: '111',
						mileage: '23',
						price: '444'
					}
				}],
				reviseDCInfo: {
					carModelId: '4545',
					price: '30',
					mileage: '3',
					extraPrices: [{
						id: '111',
						mileage: '23',
						price: '444'
					}]
				},
				formLabelWidth: '120px'
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
			models() {
				this.isReviseModelsPrice = true;	
			},
			reviseCD() {
				this.isReviseCD = true;
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
	.pagination {
		padding: 30px 0 0 40px !important;
	}
</style>