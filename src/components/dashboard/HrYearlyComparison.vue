<template>
  <div class="h-100 w-100 d-flex flex-column">
    <div class="card-container h-100 d-flex flex-column">
      <div class="card-header-custom">
        <h6 class="mb-0 font-weight-bolder text-white text-center">
          Contract Submissions - Yearly Comparison
        </h6>
      </div>
      <div class="card-body-custom flex-grow-1 p-2">
        <div class="chart-container h-100 w-100">
          <apexchart
            type="line"
            height="100%"
            class="w-100"
            :options="chartOptions"
            :series="series"
            ref="yearlyComparisonChart"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import VueApexCharts from "vue-apexcharts";
import util from "@/util.js";

export default {
  name: "HrYearlyComparison",
  components: {
    apexchart: VueApexCharts,
  },
  mixins: [util],
  data() {
    return {
      series: [
        {
          name: new Date().getFullYear().toString(),
          data: Array(12).fill(0),
        },
        {
          name: (new Date().getFullYear() - 1).toString(),
          data: Array(12).fill(0),
        },
      ],
      chartOptions: {
        chart: {
          height: "100%",
          type: "line",
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: true,
            tools: {
              download: true,
              selection: false,
              zoom: false,
              zoomin: false,
              zoomout: false,
              pan: false,
              reset: false,
            },
          },
        },
        colors: ["#0c223a", "#28a745"], // Dark blue and green
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return Number(val || 0).toLocaleString();
          },
          style: {
            fontSize: "11px",
            fontWeight: "600",
          },
        },
        stroke: {
          curve: "smooth",
          width: 3,
        },
        grid: {
          borderColor: "#e7e7e7",
          strokeDashArray: 4,
          row: {
            colors: ["transparent", "transparent"],
            opacity: 0.5,
          },
        },
        markers: {
          size: 5,
          strokeWidth: 2,
          hover: {
            size: 7,
          },
        },
        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          title: {
            text: "Month",
            style: {
              fontSize: "12px",
              fontWeight: 600,
              color: "#5e5873",
            },
          },
          labels: {
            style: {
              fontSize: "11px",
              colors: "#5e5873",
            },
          },
        },
        yaxis: {
          title: {
            text: "Contract Submissions",
            style: {
              fontSize: "12px",
              fontWeight: 600,
              color: "#5e5873",
            },
          },
          min: 0,
          tickAmount: 6,
          labels: {
            style: {
              fontSize: "11px",
              colors: "#5e5873",
            },
            formatter: function (val) {
              return Math.round(val);
            },
          },
        },
        legend: {
          position: "top",
          horizontalAlign: "center",
          floating: false,
          offsetY: 0,
          offsetX: 0,
          fontSize: "12px",
          fontWeight: 600,
          markers: {
            width: 12,
            height: 12,
            radius: 2,
          },
          itemMargin: {
            horizontal: 15,
            vertical: 5,
          },
        },
        tooltip: {
          shared: true,
          intersect: false,
          y: {
            formatter: function (val) {
              return val + " submissions";
            },
          },
        },
      },
    };
  },
  async mounted() {
    await this.fetchYearlyComparisonData();
  },
  methods: {
    ...mapActions({
      getYearlyContractsData: "appData/getYearlyContractsData",
    }),
    async fetchYearlyComparisonData() {
      try {
        const res = await this.getYearlyContractsData();
        const data = res.data;

        // Extract data from API response
        const currentLabel =
          (data.monthly_counts && data.monthly_counts.current_year_label) ||
          new Date().getFullYear();
        const previousLabel =
          (data.monthly_counts && data.monthly_counts.previous_year_label) ||
          new Date().getFullYear() - 1;
        const countCurrent =
          (data.monthly_counts && data.monthly_counts.current_year) ||
          Array(12).fill(0);
        const countPrevious =
          (data.monthly_counts && data.monthly_counts.previous_year) ||
          Array(12).fill(0);

        // Update series with API data
        this.series = [
          { name: String(currentLabel), data: countCurrent },
          { name: String(previousLabel), data: countPrevious },
        ];
      } catch (error) {
        this.displayError(error);
      }
    },
  },
  computed: {
    ...mapGetters({
      hasPermission: "appData/hasPermission",
    }),
  },
};
</script>

<style scoped>
/* Main container to fill entire space */
.h-100 {
  height: 100% !important;
}

.w-100 {
  width: 100% !important;
}

.d-flex {
  display: flex !important;
}

.flex-column {
  flex-direction: column !important;
}

.flex-grow-1 {
  flex-grow: 1 !important;
}

/* Card container */
.card-container {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin: 0.5rem;
}

/* Card header */
.card-header-custom {
  background: #0c223a;
  padding: 1rem 1.25rem;
  border-bottom: none;
}

.card-header-custom h6 {
  font-size: 1rem;
  margin: 0;
  color: white;
  letter-spacing: 0.5px;
}

/* Card body */
.card-body-custom {
  padding: 1rem;
  background-color: white;
  overflow: hidden;
}

/* Chart container */
.chart-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Ensure chart takes full height */
.apexcharts-canvas {
  width: 100% !important;
}

/* Custom styling for better appearance */
.apexcharts-tooltip {
  font-size: 12px;
}

.apexcharts-legend {
  font-size: 12px;
}

/* Legend styling */
.apexcharts-legend-series {
  margin: 0 8px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .card-container {
    margin: 0.25rem;
    border-radius: 8px;
  }

  .card-header-custom {
    padding: 0.75rem 1rem;
  }

  .card-header-custom h6 {
    font-size: 0.9rem;
  }

  .card-body-custom {
    padding: 0.5rem;
  }
}
</style>
