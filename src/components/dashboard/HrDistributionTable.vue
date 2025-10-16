<template>
  <div class="h-100 w-100 d-flex flex-column">
    <div class="card-container h-100 d-flex flex-column">
      <div class="card-header-custom">
        <h6 class="mb-0 font-weight-bolder text-white text-center">
          Top 10 Expiring Contracts
        </h6>
      </div>
      <div class="card-body-custom flex-grow-1 overflow-auto">
        <table
          class="w-100 table table-sm table-hover"
          style="font-size: 0.75rem"
        >
          <thead>
            <tr>
              <th>#</th>
              <th>Notice ID</th>
              <th>Title</th>
              <th>Company</th>
              <th>Status</th>
              <th>POC</th>
              <th>Expiry Date</th>
              <th>Days Left</th>
            </tr>
          </thead>
          <tbody v-if="contracts.length > 0">
            <tr
              v-for="(contract, index) in contracts"
              :key="contract.id"
              :class="getDaysLeftClass(contract)"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ contract.notice_id }}</td>
              <td class="text-left">
                {{ truncateText(contract.title, 30) }}
              </td>
              <td>{{ contract.company ? contract.company.name : "-" }}</td>
              <td>
                <span
                  v-if="contract.contract_status"
                  class="badge badge-pill"
                  :style="{
                    backgroundColor: contract.contract_status.color,
                    color: getContrastColor(contract.contract_status.color),
                    fontSize: '0.7rem',
                    padding: '0.25rem 0.5rem',
                  }"
                >
                  {{ contract.contract_status.name }}
                </span>
              </td>
              <td>{{ contract.poc ? contract.poc.full_name : "-" }}</td>
              <td>{{ formatDate(contract.expiry_date) }}</td>
              <td>
                <span class="font-weight-bold">
                  {{ getDaysLeft(contract.expiry_date) }}
                </span>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="8" class="text-center text-muted py-2">
                <feather-icon icon="InboxIcon" size="24" class="mb-1" />
                <p class="mb-0">No expiring contracts found</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import util from "@/util.js";

export default {
  name: "HrDistributionTable",
  mixins: [util],
  data() {
    return {
      contracts: [],
    };
  },
  async mounted() {
    await this.fetchTopExpiringContracts();
  },
  methods: {
    ...mapActions({
      getTopExpiringContracts: "appData/getTopExpiringContracts",
    }),
    async fetchTopExpiringContracts() {
      try {
        const res = await this.getTopExpiringContracts();
        this.contracts = res.data;
      } catch (error) {
        this.displayError(error);
      }
    },
    formatDate(dateString) {
      if (!dateString) return "-";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
    getDaysLeft(expiryDate) {
      if (!expiryDate) return "-";
      const today = new Date();
      const expiry = new Date(expiryDate);
      const diffTime = expiry - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return "Expired";
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "1 day";
      return `${diffDays} days`;
    },
    getDaysLeftClass(contract) {
      if (!contract.expiry_date) return "";
      const today = new Date();
      const expiry = new Date(contract.expiry_date);
      const diffTime = expiry - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return "row-expired";
      if (diffDays <= 7) return "row-critical";
      if (diffDays <= 30) return "row-warning";
      return "";
    },
    getContrastColor(hexColor) {
      if (!hexColor) return "#000000";
      const hex = hexColor.replace("#", "");
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5 ? "#000000" : "#ffffff";
    },
    truncateText(text, maxLength) {
      if (!text) return "-";
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + "...";
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
  padding: 1rem;
  border-bottom: none;
}

.card-header-custom h6 {
  font-size: 1rem;
  margin: 0;
  color: white;
  letter-spacing: 0.5px;
}

/* Card body with scrollable content */
.card-body-custom {
  padding: 0;
  overflow-y: auto;
  background-color: white;
}

/* Custom scrollbar */
.card-body-custom::-webkit-scrollbar {
  width: 8px;
}

.card-body-custom::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.card-body-custom::-webkit-scrollbar-thumb {
  background: #0c223a;
  border-radius: 4px;
}

.card-body-custom::-webkit-scrollbar-thumb:hover {
  background: #0c223a;
}

/* Table styling */
.table {
  margin-bottom: 0 !important;
  border-collapse: collapse !important;
  width: 100% !important;
}

table {
  border-collapse: collapse !important;
  width: 100% !important;
}

/* Table header styling */
table th,
.table th,
thead th {
  padding: 0.75rem 0.5rem !important;
  font-size: 0.75rem !important;
  line-height: 1.3 !important;
  border-bottom: 2px solid #e9ecef !important;
  border-top: none !important;
  border-left: none !important;
  border-right: none !important;
  background-color: #f8f9fa !important;
  color: #5e5873 !important;
  font-weight: 600 !important;
  text-align: center !important;
  position: sticky;
  top: 0;
  z-index: 10;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Table body cell styling */
table td,
.table td,
tbody td {
  padding: 0.75rem 0.5rem !important;
  font-size: 0.75rem !important;
  line-height: 1.3 !important;
  border-bottom: 1px solid #f0f0f0 !important;
  border-top: none !important;
  border-left: none !important;
  border-right: none !important;
  background-color: white !important;
  color: #5e5873 !important;
  text-align: center !important;
  vertical-align: middle !important;
}

/* Last row - no border */
tbody tr:last-child td {
  border-bottom: none !important;
}

/* Row coloring based on urgency */
.row-critical td {
  background-color: #ffe5e5 !important;
  color: #d32f2f !important;
  font-weight: 500 !important;
}

.row-warning td {
  background-color: #fff8e1 !important;
  color: #f57c00 !important;
}

.row-expired td {
  background-color: #fafafa !important;
  color: #9e9e9e !important;
}

/* Hover effect */
tbody tr:hover td {
  background-color: #f5f5f5 !important;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.row-critical:hover td {
  background-color: #ffcccc !important;
}

.row-warning:hover td {
  background-color: #fff4cc !important;
}

/* Badge styling */
.badge {
  white-space: nowrap;
  font-size: 0.7rem !important;
  padding: 0.35rem 0.65rem !important;
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

  table th,
  .table th,
  thead th {
    padding: 0.5rem 0.3rem !important;
    font-size: 0.7rem !important;
  }

  table td,
  .table td,
  tbody td {
    padding: 0.5rem 0.3rem !important;
    font-size: 0.7rem !important;
  }

  .badge {
    font-size: 0.65rem !important;
    padding: 0.25rem 0.5rem !important;
  }
}
</style>
