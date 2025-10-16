<template>
  <b-modal
    id="expiring-contracts-modal"
    title="Contracts Expiring Soon"
    size="lg"
    :visible="visible"
    @hidden="onHidden"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true"
    centered
    hide-footer
  >
    <div class="mb-3">
      <h6 class="text-muted">
        <i class="fas fa-calendar-alt mr-2"></i>
        Contracts expiring in the next 30 days ({{ contracts.length }} found)
      </h6>
    </div>

    <div v-if="contracts.length === 0" class="text-center py-4">
      <i class="fas fa-check-circle text-success" style="font-size: 3rem"></i>
      <h5 class="mt-3 text-success">No contracts expiring soon!</h5>
      <p class="text-muted">All contracts are up to date.</p>
    </div>

    <div v-else>
      <b-table
        responsive
        :fields="fields"
        :items="contracts"
        striped
        small
        hover
        :per-page="10"
        :current-page="currentPage"
      >
        <template #cell(full_name)="row">
          <div class="d-flex align-items-center">
            <i class="fas fa-user text-primary mr-2"></i>
            <strong>{{ row.item.full_name }}</strong>
          </div>
        </template>

        <template #cell(employee_id)="row">
          <span class="text-muted small">
            {{ row.item.employee_id || "N/A" }}
          </span>
        </template>

        <template #cell(organization)="row">
          <span class="badge badge-light">
            {{ row.item.organization ? row.item.organization.name : "N/A" }}
          </span>
        </template>

        <template #cell(rank_name)="row">
          <span class="badge badge-info">
            {{ row.item.rank_name ? row.item.rank_name.name : "N/A" }}
          </span>
        </template>

        <template #cell(job_title)="row">
          <span class="text-dark small">
            {{ row.item.job_title ? row.item.job_title.name : "N/A" }}
          </span>
        </template>

        <template #cell(service_type)="row">
          <span class="badge badge-secondary">
            {{ row.item.service_type ? row.item.service_type.name : "N/A" }}
          </span>
        </template>

        <template #cell(employment_to_date)="row">
          <div class="d-flex align-items-center">
            <i class="fas fa-calendar-times text-warning mr-2"></i>
            <span class="text-warning font-weight-bold">
              {{ formatDate(row.item.employment_to_date) }}
            </span>
          </div>
        </template>

        <template #cell(days_remaining)="row">
          <span
            :class="getDaysRemainingClass(row.item.employment_to_date)"
            class="badge font-weight-bold"
          >
            {{ getDaysRemaining(row.item.employment_to_date) }} days
          </span>
        </template>

        <template #cell(contact)="row">
          <div class="small">
            <div v-if="row.item.email">
              <i class="fas fa-envelope mr-1"></i>
              {{ row.item.email }}
            </div>
            <div v-if="row.item.phone">
              <i class="fas fa-phone mr-1"></i>
              {{ row.item.phone }}
            </div>
          </div>
        </template>

        <template #cell(total_pay)="row">
          <span class="text-success font-weight-bold">
            {{ row.item.total_pay ? `PKR ${row.item.total_pay}` : "N/A" }}
          </span>
        </template>

        <template #cell(actions)="row">
          <b-button
            variant="outline-primary"
            size="sm"
            @click="editContract(row.item)"
          >
            <i class="fas fa-edit mr-1"></i>
            Edit
          </b-button>
        </template>
      </b-table>

      <b-pagination
        v-if="contracts.length > 10"
        v-model="currentPage"
        :total-rows="contracts.length"
        :per-page="10"
        size="sm"
        class="mt-3"
      ></b-pagination>
    </div>

    <!-- <template #modal-footer>
      <div class="w-100 d-flex justify-content-between">
        <div>
          <small class="text-muted">
            <i class="fas fa-info-circle mr-1"></i>
            Click on actions to view details or renew contracts
          </small>
        </div>
        <div>
          <b-button variant="secondary" @click="onHidden"> Close </b-button>
          <b-button variant="primary" @click="exportData">
            <i class="fas fa-download mr-1"></i>
            Export
          </b-button>
        </div>
      </div>
    </template> -->
  </b-modal>
</template>

<script>
import moment from "moment";

export default {
  name: "ExpiringContractsModal",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    contracts: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      currentPage: 1,
      fields: [
        { key: "full_name", label: "Employee Name" },
        { key: "employee_id", label: "Employee ID" },
        { key: "organization", label: "Organization" },
        { key: "rank_name", label: "Rank" },
        { key: "job_title", label: "Job Title" },
        { key: "service_type", label: "Service Type" },
        { key: "employment_to_date", label: "Expiry Date" },
        { key: "days_remaining", label: "Days Left" },
        { key: "contact", label: "Contact" },
        { key: "total_pay", label: "Total Pay" },
        { key: "actions", label: "Actions" },
      ],
    };
  },
  methods: {
    onHidden() {
      this.$emit("close");
    },
    formatDate(date) {
      if (!date) return "N/A";
      return moment(date).format("MMM DD, YYYY");
    },
    getDaysRemaining(date) {
      if (!date) return 0;
      const today = moment();
      const expiryDate = moment(date);
      return expiryDate.diff(today, "days");
    },
    getDaysRemainingClass(date) {
      const days = this.getDaysRemaining(date);
      if (days <= 7) return "badge-danger";
      if (days <= 14) return "badge-warning";
      return "badge-info";
    },
    editContract(contract) {
      this.$emit("edit-contract", contract);
    },
    exportData() {
      this.$emit("export-data", this.contracts);
    },
  },
};
</script>

<style scoped>
.badge-danger {
  background-color: #dc3545;
  color: white;
}

.badge-warning {
  background-color: #ffc107;
  color: #212529;
}

.badge-info {
  background-color: #17a2b8;
  color: white;
}

.badge-light {
  background-color: #f8f9fa;
  color: #495057;
}

.badge-secondary {
  background-color: #6c757d;
  color: white;
}
</style>
