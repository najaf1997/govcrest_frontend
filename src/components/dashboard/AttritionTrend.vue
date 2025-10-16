<template>
  <div class="h-100 p-1 pt-50 rounded" style="background-color: white">
    <div class="chart-container h-100">
      <apexchart
        type="line"
        height="100%"
        :options="chartOptions"
        :series="series"
        ref="attritionChart"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import VueApexCharts from "vue-apexcharts";
import util from "@/util.js";

export default {
  name: "AttritionTrend",
  components: {
    apexchart: VueApexCharts,
  },
  mixins: [util],
  data() {
    return {
      series: [{ name: "Active Employees", data: [] }],
      chartOptions: {
        chart: {
          type: "line",
          toolbar: {
            show: true,
          },
          parentHeightOffset: 0,
          height: "100%",
        },
        title: {
          text: "Attrition Trend",
          align: "center",
          margin: 10,
          style: {
            fontSize: "10px",
            fontWeight: "bold",
          },
        },
        stroke: {
          curve: "smooth",
          width: 3,
          colors: ["#57da65"], // Green line color
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            type: "vertical",
            shadeIntensity: 0.5,
            gradientToColors: ["#90EE90"], // Light green
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100],
          },
        },
        colors: ["#57da65"], // Green color for line
        xaxis: {
          categories: [],
          labels: {
            style: {
              fontSize: "8px",
              fontWeight: "normal",
            },
            rotate: -45,
            maxHeight: 60,
          },
        },
        yaxis: {
          title: {
            text: "Employee Count",
            style: {
              fontSize: "10px",
            },
          },
          min: 0,
          tickAmount: 5,
          labels: {
            formatter: function (value) {
              return Math.round(value || 0);
            },
            style: {
              fontSize: "10px",
            },
          },
        },
        grid: {
          borderColor: "#f1f1f1",
          strokeDashArray: 3,
          xaxis: {
            lines: {
              show: false,
            },
          },
          yaxis: {
            lines: {
              show: true,
            },
          },
        },
        tooltip: {
          shared: true,
          intersect: false,
          x: {
            formatter: function (val, opts) {
              const idx = opts.dataPointIndex;
              const cats =
                (opts.w &&
                  opts.w.config &&
                  opts.w.config.xaxis &&
                  opts.w.config.xaxis.categories) ||
                [];
              const label = cats[idx] !== undefined ? cats[idx] : "";
              return `Month: ${label}`;
            },
          },
          y: {
            formatter: function (val, opts) {
              return `${Math.round(val || 0)} employees`;
            },
          },
        },
        markers: {
          size: 4,
          colors: ["#1b74b9"], // Blue markers
          strokeColors: "#fff",
          strokeWidth: 0,
          hover: {
            size: 8,
          },
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
      },
    };
  },
  async mounted() {
    await this.fetchAttritionTrendData();
  },
  methods: {
    ...mapActions({
      getAttritionTrend: "appData/getAttritionTrend",
    }),
    async fetchAttritionTrendData() {
      try {
        const res = await this.getAttritionTrend();
        const data = res.data;
        console.log(data);
        if (data && Array.isArray(data) && data.length > 0) {
          const months = data.map((item) => item.month);
          const counts = data.map((item) => item.count || 0);

          this.chartOptions = {
            ...this.chartOptions,
            xaxis: { ...this.chartOptions.xaxis, categories: months },
          };
          this.series = [{ name: "Active Employees", data: counts }];
        }
      } catch (error) {
        // Error handling removed by user request
      }
    },
  },
  computed: {
    ...mapGetters({}),
  },
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: calc(100% - 30px);
}

/* Ensure chart takes full height */
.apexcharts-canvas {
  height: 100% !important;
}

/* Custom styling for better appearance */
.apexcharts-tooltip {
  font-size: 12px;
}

.apexcharts-legend {
  font-size: 12px;
}
</style>
