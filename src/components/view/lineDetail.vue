<template>
  <div class="lineDetail">
    <el-tabs :active-name="lineDetail" v-model="lineDetail" type="card" @tab-click="handleClick">
      <el-tab-pane label="默认拼车价" name="defaultCarpool">
        <defaultCarpool></defaultCarpool>
      </el-tab-pane>
      <el-tab-pane label="默认包车价" name="defaultChartered">
        <defaultChartered></defaultChartered>
      </el-tab-pane>
      <el-tab-pane label="拼车配置" name="carpoolDeploy">
        <carpoolDeploy></carpoolDeploy>
      </el-tab-pane>
      <el-tab-pane label="包车配置" name="charteredDeploy">
        <charteredDeploy></charteredDeploy>
      </el-tab-pane>
      <el-tab-pane label="定点限制" name="pointLimit">
        <pointLimit></pointLimit>
      </el-tab-pane>
      <el-tab-pane label="调价区域" name="priceRegion">
        <priceRegion></priceRegion>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import carpoolDeploy from "./lineDetails/carpoolDeploy.vue"
  import charteredDeploy from "./lineDetails/charteredDeploy.vue"
  import defaultCarpool from "./lineDetails/defaultCarpool.vue"
  import defaultChartered from "./lineDetails/defaultChartered.vue"
  import pointLimit from "./lineDetails/pointLimit.vue"
  import priceRegion from "./lineDetails/priceRegion.vue"
  export default {
    name: "lineDetail",
    data() {
      return {
        lineDetail: "defaultCarpool",
        line: {}
      }
    },
    methods: {
      handleClick() {
        sessionStorage.setItem("tabIdx", this.lineDetail);
      },
      queryLineDetail(id) {
        var that = this;
        this.$http.get("/lineDetail.shtml", {params: {id: id}}).then(data => {
          if (data.code == 200) {
            that.line = data.data;
          }
        })
      }
    },
    components: {
      carpoolDeploy,
      charteredDeploy,
      defaultCarpool,
      defaultChartered,
      pointLimit,
      priceRegion
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.queryLineDetail(to.query.lineId);
      })
    },
    created() {
    }
  }
</script>