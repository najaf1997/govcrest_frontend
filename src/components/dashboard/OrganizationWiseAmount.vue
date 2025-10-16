<template>
  <b-col md="" class="h-100">
    <b-row class="h-100">
      <b-col md="12" class="h-100 rounded" style="background-color: white">
        <apexchart
          type="bar"
          height="100%"
          :options="chartOptions"
          :series="series"
          ref="organizationChart"
        />
      </b-col>
    </b-row>
  </b-col>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import VueApexCharts from "vue-apexcharts";
import util from "@/util.js";

export default {
  name: "OrganizationWiseAmount",
  components: {
    apexchart: VueApexCharts,
  },
  mixins: [util],
  data() {
    return {
      series: [
        {
          name: "Count",
          data: [],
        },
        {
          name: "Amount",
          data: [],
        },
      ],
      chartOptions: {
        chart: {
          type: "bar",
          toolbar: {
            show: true,
          },
          parentHeightOffset: 0,
        },
        title: {
          text: "Organization wise distribution",
          align: "center",
          margin: 10, // Add padding from top
          style: {
            fontSize: "10px",
            fontWeight: "bold",
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "20%",
            borderRadius: 8,
            borderRadiusApplication: "around",
          },
        },
        legend: {
          show: true,
          position: "top",
          horizontalAlign: "center",
          fontSize: "12px",
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: false, // Remove stroke to make rounded corners more visible
        },
        xaxis: {
          categories: [],
          labels: {
            style: {
              fontSize: "6px",
              fontWeight: "normal",
            },
            rotate: -45, // Rotate labels for better fit
          },
        },
        yaxis: [
          {
            title: {
              text: "Count",
            },
            min: 0,
            tickAmount: 5,
            labels: {
              formatter: function (value) {
                return Number(value || 0).toLocaleString();
              },
              style: {
                fontSize: "12px",
                colors: "#1b74b9", // Blue for count axis
              },
            },
          },
          {
            opposite: true,
            title: {
              text: "Amount (PKR)",
            },
            min: 0,
            tickAmount: 5,
            labels: {
              formatter: function (value) {
                return Number(value || 0).toLocaleString();
              },
              style: {
                fontSize: "12px",
                colors: "#57da65", // Green for amount axis
              },
            },
          },
        ],
        fill: {
          type: "solid",
        },
        colors: ["#1b74b9", "#57da65"], // Blue for count, green for amount
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
              return `Organization: ${label}`;
            },
          },
          y: {
            formatter: function (val, opts) {
              const seriesName = opts.w.globals.seriesNames[opts.seriesIndex];
              if (seriesName === "Count") {
                return `Count: ${Number(val || 0).toLocaleString()}`;
              } else {
                return `Amount: ${Number(val || 0).toLocaleString()} PKR`;
              }
            },
          },
        },
      },
      // Line chart data (same as HrRankWise)
      seriesline: [{ name: "Amount", data: [] }],
      chartOptionsline: {
        chart: {
          type: "line",
          toolbar: {
            show: true,
          },
          parentHeightOffset: 0,
        },
        title: {
          text: "Organization Trend",
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
        },
        colors: ["#228B22"],
        xaxis: {
          categories: [],
          labels: {
            style: {
              fontSize: "6px",
              fontWeight: "normal",
            },
            rotate: -45,
          },
        },
        yaxis: {
          title: {
            text: "Amount (PKR)",
          },
          min: 0,
          tickAmount: 5,
          labels: {
            formatter: function (value) {
              if (Number(value) % 1 === 0) {
                return Number(value || 0).toLocaleString();
              }
              return "";
            },
            style: {
              fontSize: "12px",
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
              return `Organization: ${label}`;
            },
          },
          y: {
            formatter: function (val, opts) {
              return `PKR ${Number(val || 0).toLocaleString()}`;
            },
          },
        },
      },
    };
  },
  async mounted() {
    await this.fetchOrganizationWiseData();
  },
  methods: {
    ...mapActions({
      getOrganizationWiseAmount: "appData/getOrganizationWiseAmount",
    }),
    async fetchOrganizationWiseData() {
      try {
        const res = await this.getOrganizationWiseAmount();
        const data = res.data;
        console.log("Organization Wise Data:", data);

        if (data && Array.isArray(data) && data.length > 0) {
          const labels = data.map((item) => item.name);
          const counts = data.map((item) => item.count || 0);
          const amounts = data.map((item) => item.amount || 0);

          // Update bar chart
          this.chartOptions = {
            ...this.chartOptions,
            xaxis: { ...this.chartOptions.xaxis, categories: labels },
          };
          this.series = [
            {
              name: "Count",
              data: counts,
            },
            {
              name: "Amount",
              data: amounts,
            },
          ];

          // Update line chart
          this.chartOptionsline = {
            ...this.chartOptionsline,
            xaxis: { ...this.chartOptionsline.xaxis, categories: labels },
          };
          this.seriesline = [{ name: "Amount", data: amounts }];
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
/* Component-specific styles if needed */
</style>
