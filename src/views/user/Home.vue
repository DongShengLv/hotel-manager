/* 首页 */
<template>
  <div class="main" ref="main">home</div>
</template>

<script>
//导入 echarts
import * as echarts from "echarts";

export default {
  name: "Home",

  data() {
    return {
      totalTypePrice: [],
    };
  },

  created() {},

  async mounted() {
    //获取每种房型的销售额
    let res = await this.$get("/RoomType/TotalTypePrice");
    this.totalTypePrice = res;
    //初始化 echarts实例
    let myChart = echarts.init(this.$refs.main);
    //绘制图表
    myChart.setOption({
      title: {
        text: "客房入住情况",
      },
      tooltip: {},
      xAxis: {
        data: this.totalTypePrice.map((r) => r.roomtypeName),
      },
      yAxis: {},
      series: [
        {
          name: "营业额",
          type: "bar",
          data: this.totalTypePrice.map((r) => r.totalMoney),
        },
      ],
    });
  },
};
</script>

<style scoped lang="scss">
.main {
  margin: 0;
  width: 1000px;
  height:520px;
}
</style>