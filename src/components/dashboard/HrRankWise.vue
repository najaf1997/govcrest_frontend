<template>
  <b-col md="" class="h-100">
    <b-row class="h-100">
      <b-col md="12" class="h-100 rounded" style="background-color: white">
        <apexchart
          type="bar"
          height="100%"
          :options="chartOptions"
          :series="series"
          ref="rankChart"
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
  name: "HrRankWise",
  components: {
    apexchart: VueApexCharts,
  },
  mixins: [util],
  data() {
    return {
      // Bar chart data
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
          text: "Rank wise distribution",
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
            columnWidth: "80%",
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
              return `Rank: ${label}`;
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
    };
  },
  async mounted() {
    await this.fetchRankWiseData();
  },
  methods: {
    ...mapActions({
      getRankWiseAmount: "appData/getRankWiseAmount",
    }),
    async fetchRankWiseData() {
      try {
        const res = await this.getRankWiseAmount();
        const data = res.data;
        console.log("Rank Wise Data:", data);

        // Process array of objects format: [{amount: 0, count: 0, name: "2nd Lieutenant"}, ...]
        if (data && Array.isArray(data) && data.length > 0) {
          // Extract labels from name property
          const labels = data.map((item) => item.name);

          // Extract counts from count property
          const counts = data.map((item) => item.count || 0);

          // Extract amounts from amount property
          const amounts = data.map((item) => item.amount || 0);

          this.chartOptions = {
            ...this.chartOptions,
            xaxis: {
              ...this.chartOptions.xaxis,
              categories: labels,
            },
          };

          // Update series with both count and amount data
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
        }
      } catch (error) {
        this.displayError(error);
      }
    },
  },
  computed: {
    ...mapGetters({
      hasRole: "appData/hasRole",
      hasPermission: "appData/hasPermission",
      getLoggedInUser: "appData/getLoggedInUser",
    }),
  },
};
</script>

<style scoped>
/* Add any specific styling if needed */
</style>
