<template>
  <div class="lineCarpoolDeploy">
    <el-form :inline="true" :model="form" label-width="120px">
      <el-row>
        <el-form-item label="线路">
          <span>{{$parent.$parent.$parent.line.srcCity}}</span>
          <span>-</span>
          <span>{{$parent.$parent.$parent.line.dstCity}}</span>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="开始时间">
          <div>
            <el-select v-model="timeInfo.startIdx" placeholder="选择时间">
              <el-option v-for="(time, $index) in times" :label="time" :value="$index"></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="结束时间">
          <div>
            <el-select v-model="timeInfo.endIdx" placeholder="选择时间">
              <el-option v-for="(time, $index) in times" :label="time" :value="$index"></el-option>
            </el-select>
          </div>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="间隔时间">
          <el-input placeholder="请输入间隔时间" style="width: 217px;" v-model="timeInfo.intervalMin">
            <template slot="append">分钟</template>
          </el-input>
        </el-form-item>
        <el-form-item label="预约时间">
          <el-input placeholder="请输入提前时间" style="width: 217px;" v-model="timeInfo.minReservMin">
            <template slot="append">分钟</template>
          </el-input>
        </el-form-item>
        <el-button type="primary" icon="plus" @click="add">添加</el-button>
      </el-row>
    </el-form>
    <el-table :data="lineList" stripe border style="width: 100%">
      <el-table-column align='center' prop="startIdx" label="开始时间">
        <template scope="props">
          <span>{{[5]}}</span>
        </template>
      </el-table-column>
      <el-table-column align='center' prop="times[endIdx]" label="结束时间"></el-table-column>
      <el-table-column align='center' prop="intervalMin" label="间隔时间"></el-table-column>
      <el-table-column align='center' prop="minReservMin" label="预约时间"></el-table-column>
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
    <el-dialog v-model="isReviseCD" title="修改拼车配置" size='tiny'>
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
          <el-form-item label="拼车起步价">
            <el-input v-model="form.name" style='width: 217px;'></el-input>
            <span>元</span>
          </el-form-item>
          <el-form-item label="拼车包含公里数">
            <el-input v-model="form.name" style='width: 217px;'></el-input>
            <span>公里</span>
          </el-form-item>
          <el-button type="primary">返回</el-button>
          <el-button type="primary" icon="plus" @click="add">添加</el-button>
        </el-row>
      </el-form>
      <el-table :data="DCTableData" stripe border style="width: 100%">
        <el-table-column align='center' prop="carModelId" label="车型"></el-table-column>
        <el-table-column align='center' prop="price" label="拼车起步价"></el-table-column>
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
    </el-dialog>
    <el-dialog v-model="isReviseDC" title="修改默认拼车价" size='small'>
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
        times: [], //可选时间列表
        value1: '',
        timeInfo: {
          startIdx: "",
          endIdx: "",
          intervalMin: "",//间隔分钟数
          minReservMin: ""//提前预约分钟数
        },
        line: {}, //线路详情
        lineList: [],
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        currentPage4: 4,
        total: 200,
        isReviseDC: false,
        isReviseCD: false,
        isReviseModelsPrice: false,
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
    created() {
      this.times = this.items();
    },
    methods: {
      queryTimeList() {
        console.log(this.times);
        var that = this;
        this.$http.get("/queryLineTimeList.shtml", 
          { params: { id: this.$parent.$parent.$parent.line.id, type: "share" } })
          .then(data => {
            console.log(data);
            if (data.code == 200) {
              that.lineList = data.data;
            }
            
          });
      },
      add() {
        var taht = this;
        this.line = this.$parent.$parent.$parent.line;
        if (this.timeInfo.intervalMin % 30 == 0 && this.timeInfo.intervalMin/30*2 > (this.timeInfo.endIdx - this.timeInfo.startIdx)) {
          this.$notify({
            title: '错误',
            message: "间隔时间必须是30的整倍数，且 (结束时间 - 开始时间) * 30 要大于 间隔时间的2倍",
            type: 'error'
          });
          return;
        }
        this.$http.post("/lineTimeListAdd.shtml", "param=" + JSON.stringify(this.timeInfo) + "&id=" + line.id)
          .then(data => {
            console.log(data);
            if(data.code == 200) {
              that.$notify({
                title: '成功',
                message: "添加成功",
                type: 'success'
              });
            } else {
              that.$notify({
                title: '错误',
                message: data.msg || "添加失败",
                type: 'error'
              });
            }
          })
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
      items() {
        const start = "00:00";
        const end = "23:59";
        const step = "00:30";
        const result = [];
        const that = this;
        if(start && end && step) {
          let current = start;
          while(that.compareTime(current, end) <= 0) {
            result.push(current);
            current = that.nextTime(current, step);
          }
        }
        return result;
      },
      parseTime(time) {
        const values = ('' || time).split(':');
        if(values.length >= 2) {
          const hours = parseInt(values[0], 10);
          const minutes = parseInt(values[1], 10);
          return {
            hours,
            minutes
          };
        }
        return null;
      },
      compareTime(time1, time2) {
        const value1 = this.parseTime(time1);
        const value2 = this.parseTime(time2);
        const minutes1 = value1.minutes + value1.hours * 60;
        const minutes2 = value2.minutes + value2.hours * 60;
        if(minutes1 === minutes2) {
          return 0;
        }
        return minutes1 > minutes2 ? 1 : -1;
      },
      nextTime(time, step) {
        const that = this;
        const timeValue = this.parseTime(time);
        const stepValue = this.parseTime(step);

        const next = {
          hours: timeValue.hours,
          minutes: timeValue.minutes
        };
        next.minutes += stepValue.minutes;
        next.hours += stepValue.hours;
        next.hours += Math.floor(next.minutes / 60);
        next.minutes = next.minutes % 60;
        return that.formatTime(next);
      },
      formatTime(time) {
        return(time.hours < 10 ? '0' + time.hours : time.hours) + ':' + (time.minutes < 10 ? '0' + time.minutes : time.minutes);
      }
    },
    watch: {
      "$parent.$parent.$parent.lineDetail": function(name) {
        console.log(1);
        if (name == "carpoolDeploy") {
          this.queryTimeList();
        }
      }
    }
  }
</script>
<style>
  .pagination {
    padding: 30px 0 0 40px !important;
  }
</style>