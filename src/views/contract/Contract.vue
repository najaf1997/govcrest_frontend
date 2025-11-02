<template>
  <div>
    <b-row class="mb-1" align-v="center">
      <b-col md="12" class="text-right">
        <b-button
          variant="primary"
          pill
          @click="createContract"
          v-if="hasPermission('create_contract')"
        >
          <feather-icon icon="PlusIcon" class="mr-50" />
          <span class="align-middle">Create</span>
        </b-button>
      </b-col>
    </b-row>
    <b-card>
      <b-table
        responsive
        :fields="fields"
        :items="contracts"
        details-td-class="m-0 p-0"
        small
        v-if="hasPermission('read_contract')"
        :per-page="0"
        :tbody-tr-class="getRowClass"
      >
        <!-- Column Header Filters -->
        <template #head(notice_id)>
          <div class="d-flex flex-column">
            <span class="mb-1 font-weight-bold">Notice ID</span>
            <b-input-group size="sm">
              <b-form-input
                v-model="noticeId"
                placeholder="Filter..."
                @input="fetchPaginatedData"
              ></b-form-input>
              <b-input-group-append>
                <b-button
                  size="sm"
                  variant="outline-secondary"
                  @click="
                    noticeId = '';
                    fetchPaginatedData();
                  "
                  v-if="noticeId"
                >
                  <feather-icon icon="XIcon" size="12" />
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </div>
        </template>
        <template #head(contract_status)>
          <div class="d-flex flex-column">
            <span class="mb-50 font-weight-bold">Contract Status</span>
            <VueSelectPaginated
              name=""
              label="name"
              searchBy="name"
              :prevSelected="contractStatusObj"
              :getListMethod="getContractStatuses"
              customClass="column-filter-select"
              @setMethod="
                (value) => {
                  contractStatusObj = value;
                }
              "
            />
          </div>
        </template>
        <template #head(poc)>
          <div class="d-flex flex-column">
            <span class="mb-50 font-weight-bold">POC</span>
            <VueSelectPaginated
              name=""
              label="full_name"
              searchBy="name"
              :prevSelected="pocObj"
              :getListMethod="getUsers"
              customClass="column-filter-select"
              @setMethod="
                (value) => {
                  pocObj = value;
                }
              "
            />
          </div>
        </template>
        <template #head(issue_date)>
          <div class="d-flex flex-column">
            <span class="mb-1 font-weight-bold">Issue Date</span>
            <b-form-input
              v-model="issueDate"
              type="date"
              size="sm"
              @change="fetchPaginatedData"
            ></b-form-input>
          </div>
        </template>
        <template #head(expiry_date)>
          <div class="d-flex flex-column">
            <span class="mb-1 font-weight-bold">Expiry Date & Timezone</span>
            <b-form-input
              v-model="expiryDate"
              type="date"
              size="sm"
              @change="fetchPaginatedData"
            ></b-form-input>
          </div>
        </template>
        <template #head(inactive_date)>
          <div class="d-flex flex-column">
            <span class="mb-1 font-weight-bold">Inactive Date</span>
            <b-form-input
              v-model="inactiveDate"
              type="date"
              size="sm"
              @change="fetchPaginatedData"
            ></b-form-input>
          </div>
        </template>

        <template #cell(notice_id)="row">
          <div class="d-flex align-items-center">
            <!-- Expiry Alert Indicator -->
            <b-badge
              v-if="row.item.expiry_alert && row.item.expiry_alert.alert"
              variant="danger"
              pill
              class="mr-2 alert-badge-pop"
              v-b-tooltip.hover
              :title="`Contract will expire in ${row.item.expiry_alert.days_until_expiry} days`"
            >
              <feather-icon icon="AlertTriangleIcon" size="14" />
            </b-badge>
            <span>{{ row.item.notice_id }}</span>
          </div>
        </template>
        <template #cell(created_by_data)="row">
          {{
            row.item.created_by_data ? row.item.created_by_data.username : ""
          }}
        </template>
        <template #cell(updated_by_data)="row">
          {{
            row.item.updated_by_data ? row.item.updated_by_data.username : ""
          }}
        </template>
        <template #cell(company)="row">
          {{ row.item.company ? row.item.company.name : "" }}
        </template>
        <template #cell(contract_status)="row">
          <span
            v-if="row.item.contract_status"
            class="badge badge-pill"
            :style="{
              backgroundColor: row.item.contract_status.color,
              color: getContrastColor(row.item.contract_status.color),
            }"
          >
            {{ row.item.contract_status.name }}
          </span>
        </template>
        <template #cell(poc)="row">
          <div
            v-if="
              row.item.poc &&
              Array.isArray(row.item.poc) &&
              row.item.poc.length > 0
            "
            class="d-inline-flex"
            style="flex-wrap: nowrap; white-space: nowrap"
          >
            <b-badge
              v-for="user in row.item.poc"
              :key="user.id"
              variant="primary"
              class="mr-1"
            >
              {{ user.full_name }}
            </b-badge>
          </div>
          <span v-else-if="row.item.poc && !Array.isArray(row.item.poc)">
            {{ row.item.poc.full_name }}
          </span>
          <span v-else>-</span>
        </template>
        <template #cell(issue_date)="row">
          {{ formatDate(row.item.issue_date) }}
        </template>
        <template #cell(expiry_date)="row">
          <span v-if="row.item.expiry_date">
            {{ formatDate(row.item.expiry_date) }}
            <small class="text-muted ml-1">
              ({{
                row.item.expiry_timezone_display ||
                row.item.expiry_timezone ||
                "-"
              }})
            </small>
          </span>
          <span v-else>-</span>
        </template>
        <template #cell(inactive_date)="row">
          {{ formatDate(row.item.inactive_date) }}
        </template>
        <template #cell(submitted_at)="row">
          {{ formatDate(row.item.submitted_at) }}
        </template>
        <template #cell(awarded_at)="row">
          {{ formatDate(row.item.awarded_at) }}
        </template>
        <template #cell(manufacturer_name)="row">
          {{ row.item.manufacturer_name || "-" }}
        </template>
        <template #cell(manufacturer_email)="row">
          {{ row.item.manufacturer_email || "-" }}
        </template>
        <template #cell(notes)="row">
          <span v-if="row.item.notes" :title="row.item.notes">
            {{ truncateText(row.item.notes, 50) }}
          </span>
          <span v-else>-</span>
        </template>
        <template #cell(contract_link)="row">
          <a
            v-if="row.item.contract_link"
            :href="row.item.contract_link"
            target="_blank"
            class="text-primary"
          >
            View Contract
          </a>
        </template>
        <template #cell(manage)="row">
          <b-button
            variant="primary"
            pill
            size="sm"
            class="mr-50"
            @click="viewContract(row.item)"
            v-if="hasPermission('read_contract')"
          >
            <feather-icon icon="EyeIcon" size="14" />
          </b-button>
          <b-button
            variant="info"
            pill
            size="sm"
            class="mr-50"
            @click="editContract(row.item)"
            v-if="
              hasPermission('update_contract') &&
              (hasRole('su') ||
                hasRole('ca') ||
                (hasRole('emp') &&
                  row.item.poc &&
                  getLoggedInUser &&
                  ((Array.isArray(row.item.poc) &&
                    row.item.poc.some(
                      (poc) => poc.id === getLoggedInUser.id
                    )) ||
                    (!Array.isArray(row.item.poc) &&
                      row.item.poc.id === getLoggedInUser.id))))
            "
          >
            <feather-icon icon="EditIcon" size="14" />
          </b-button>
          <b-button
            variant="danger"
            pill
            size="sm"
            @click="removeContract(row.item)"
            v-if="
              hasPermission('delete_contract') &&
              (hasRole('su') ||
                hasRole('ca') ||
                (hasRole('emp') &&
                  row.item.poc &&
                  getLoggedInUser &&
                  ((Array.isArray(row.item.poc) &&
                    row.item.poc.some(
                      (poc) => poc.id === getLoggedInUser.id
                    )) ||
                    (!Array.isArray(row.item.poc) &&
                      row.item.poc.id === getLoggedInUser.id))))
            "
          >
            <feather-icon icon="TrashIcon" size="14" />
          </b-button>
        </template>
      </b-table>
      <b-pagination
        size="md"
        :total-rows="totalItems"
        v-model="currentPage"
        :per-page="perPage"
      ></b-pagination>
    </b-card>
    <CreateContractModal
      @modalClosed="onModalClosed"
      :key="`create-${createContractModalCount}`"
    />
    <EditContractModal
      :contract="contract"
      @modalClosed="onModalClosed"
      :key="`edit-${editContractModalCount}`"
    />
    <ViewContractModal
      :contract="contract"
      @edit-contract="editContractFromView"
      @delete-contract="removeContract"
      :key="`view-${viewContractModalCount}`"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import VueSelectPaginated from "@/components/ui/VueSelectPaginated.vue";
import CreateContractModal from "@/components/contract/CreateContractModal.vue";
import EditContractModal from "@/components/contract/EditContractModal.vue";
import ViewContractModal from "@/components/contract/ViewContractModal.vue";

import util from "@/util.js";

export default {
  components: {
    CreateContractModal,
    EditContractModal,
    ViewContractModal,
    VueSelectPaginated,
  },
  data() {
    return {
      fields: [
        {
          key: "notice_id",
          label: "Notice ID",
          thStyle: { minWidth: "200px" },
        },
        { key: "title", label: "Title", thStyle: { minWidth: "200px" } },
        {
          key: "contract_status",
          label: "Status",
          thStyle: { minWidth: "200px" },
        },
        { key: "poc", label: "POC", thStyle: { minWidth: "200px" } },
        // {
        //   key: "issue_date",
        //   label: "Issue Date",
        //   thStyle: { minWidth: "200px" },
        // },
        {
          key: "expiry_date",
          label: "Expiry Date & Timezone",
          thStyle: { minWidth: "200px" },
        },
        // {
        //   key: "inactive_date",
        //   label: "Inactive Date",
        //   thStyle: { minWidth: "200px" },
        // },
        // {
        //   key: "submitted_at",
        //   label: "Submitted At",
        //   thStyle: { minWidth: "200px" },
        // },
        // {
        //   key: "awarded_at",
        //   label: "Awarded At",
        //   thStyle: { minWidth: "200px" },
        // },
        {
          key: "contract_link",
          label: "Contract Link",
          thStyle: { minWidth: "200px" },
        },
        { key: "manage", label: "Manage", thStyle: { minWidth: "200px" } },
      ],
      currentPage: 1,
      perPage: 0,
      totalItems: 0,
      contracts: [],
      contract: null,
      editContractModalCount: 0,
      createContractModalCount: 0,
      viewContractModalCount: 0,
      noticeId: "",
      contractStatusObj: null,
      pocObj: null,
      issueDate: "",
      expiryDate: "",
      inactiveDate: "",
    };
  },
  mixins: [util],
  async mounted() {
    await this.fetchPaginatedData();
    console.log("Logged in user:", this.getLoggedInUser);
  },
  methods: {
    ...mapActions({
      getContracts: "appData/getContracts",
      deleteContract: "appData/deleteContract",
      getUsers: "appData/getUsers",
      getContractStatuses: "appData/getContractStatuses",
    }),
    getContrastColor(hexColor) {
      // Convert hex to RGB
      const hex = hexColor.replace("#", "");
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);

      // Calculate luminance
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      // Return black for light colors, white for dark colors
      return luminance > 0.5 ? "#000000" : "#ffffff";
    },
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
    truncateText(text, maxLength) {
      if (!text) return "";
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + "...";
    },
    async fetchPaginatedData() {
      try {
        const res = await this.getContracts({
          pageNumber: this.currentPage,
          notice_id: this.noticeId,
          contract_status: this.contractStatusObj
            ? this.contractStatusObj.name
            : "",
          poc: this.pocObj ? this.pocObj.full_name : "",
          issue_date: this.issueDate,
          expiry_date: this.expiryDate,
          inactive_date: this.inactiveDate,
        });
        this.contracts = res.data.results;
        this.totalItems = res.data.count;
        this.perPage = res.data.per_page;
      } catch (error) {
        this.displayError(error);
      }
    },
    createContract() {
      this.createContractModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("create-contract-modal");
      });
    },
    viewContract(contract) {
      this.contract = contract;
      this.viewContractModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("view-contract-modal");
      });
    },
    editContract(contract) {
      this.contract = contract;
      this.editContractModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("edit-contract-modal");
      });
    },
    editContractFromView(contract) {
      this.contract = contract;
      this.editContractModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("edit-contract-modal");
      });
    },
    async removeContract(contract) {
      this.contract = contract;

      this.$swal({
        title: "Are you sure?",
        icon: "warning",
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: "Confirm",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-danger ml-1",
        },
        buttonsStyling: false,
      }).then(async (result) => {
        if (result.value) {
          try {
            const res = await this.deleteContract({
              pk: this.contract.id,
            });
            if (res.status === 200) {
              this.$swal({
                title: "Contract deleted successfully",
                icon: "success",
              });
              if (
                (this.totalItems - 1) % this.perPage === 0 &&
                this.currentPage !== 1
              ) {
                this.currentPage -= 1;
              } else {
                await this.fetchPaginatedData();
              }
            }
          } catch (error) {
            this.show = false;
            this.displayError(error);
          }
        } else {
          this.show = false;
        }
      });
    },
    async onModalClosed() {
      await this.fetchPaginatedData();
    },
    getRowClass(item, type) {
      if (!item || type !== "row") return "";
      if (item.expiry_alert && item.expiry_alert.alert) {
        return "table-danger";
      }
      return "";
    },
  },
  computed: {
    ...mapGetters({
      hasPermission: "appData/hasPermission",
      hasRole: "appData/hasRole",
      getLoggedInUser: "appData/getLoggedInUser",
    }),
  },
  watch: {
    currentPage: async function (val) {
      await this.fetchPaginatedData();
    },
    contractStatusObj: async function (val) {
      if (this.currentPage === 1) {
        await this.fetchPaginatedData();
      } else {
        this.currentPage = 1;
      }
    },
    pocObj: async function (val) {
      if (this.currentPage === 1) {
        await this.fetchPaginatedData();
      } else {
        this.currentPage = 1;
      }
    },
  },
};
</script>

<style scoped>
.alert-badge-pop {
  animation: popInOut 1.5s infinite ease-in-out;
  box-shadow: 0 0 10px rgba(220, 53, 69, 0.5);
}

@keyframes popInOut {
  0% {
    transform: scale(1);
    box-shadow: 0 0 10px rgba(220, 53, 69, 0.5);
  }
  50% {
    transform: scale(1.3);
    box-shadow: 0 0 20px rgba(220, 53, 69, 0.8);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 10px rgba(220, 53, 69, 0.5);
  }
}

.table-danger {
  background-color: rgba(220, 53, 69, 0.1) !important;
}

.table-danger:hover {
  background-color: rgba(220, 53, 69, 0.15) !important;
}

/* Hide the label from VueSelectPaginated in column filters */
.column-filter-select .labelStyle {
  display: none !important;
  margin: 0 !important;
}

/* Remove extra margin from form group */
.column-filter-select .form-group {
  margin-bottom: 0 !important;
}

/* Make VueSelectPaginated look exactly like input fields - same colors and styling */
.column-filter-select .vSelectStyle .vs__dropdown-toggle {
  background-color: #fff !important;
  background: #fff !important;
  border: 1px solid #d8d6de !important;
  border-radius: 0.357rem !important;
  min-height: calc(1.5em + 0.75rem + 0px) !important;
  padding: 0.375rem 0.75rem !important;
}

.column-filter-select .vSelectStyle .vs__search {
  background-color: #fff !important;
  background: #fff !important;
  padding: 0 !important;
  margin: 0 !important;
  font-size: 1rem !important;
  line-height: 1.5 !important;
  color: #5e5873 !important;
}

.column-filter-select .vSelectStyle .vs__dropdown-toggle * {
  background-color: #fff !important;
  background: #fff !important;
}

.column-filter-select .vSelectStyle {
  background-color: #fff !important;
  background: #fff !important;
}

.column-filter-select .vSelectStyle .vs__dropdown-toggle:focus-within {
  border-color: #1a6330 !important;
  box-shadow: 0 0 0 0.2rem rgba(15, 74, 17, 0.15) !important;
}

.column-filter-select .vSelectStyle .vs__selected {
  margin: 0 !important;
  padding: 0 !important;
  background-color: transparent !important;
  color: #5e5873 !important;
}

.column-filter-select .vSelectStyle .vs__actions {
  padding: 0 0.5rem !important;
}

.column-filter-select .vSelectStyle .vs__clear {
  fill: #6c757d !important;
}

.column-filter-select .vSelectStyle .vs__open-indicator {
  fill: #6c757d !important;
}

/* Additional aggressive targeting */
.vs__dropdown-toggle {
  background-color: #fff !important;
  background: #fff !important;
}

.vs__search {
  background-color: #fff !important;
  background: #fff !important;
}
</style>
