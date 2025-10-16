<template>
  <div>
    <div class="text-right mb-1">
      <b-button
        variant="primary"
        pill
        @click="createContract"
        v-if="hasPermission('create_contract')"
      >
        <feather-icon icon="PlusIcon" class="mr-50" />
        <span class="align-middle">Create</span>
      </b-button>
    </div>
    <b-card>
      <b-row class="mb-1" align-v="center">
        <b-col md="7">
          <div v-if="searchType">
            <b-form-group
              label="Notice ID"
              label-for="noticeId"
              class="w-50"
              v-if="searchType.value === 1"
            >
              <b-input-group>
                <template #prepend> </template>
              </b-input-group>
              <b-form-input
                id="noticeId"
                v-model="noticeId"
                placeholder="Notice ID"
              />
            </b-form-group>
            <b-form-group
              label="Title"
              label-for="title"
              class="w-50"
              v-if="searchType.value === 2"
            >
              <b-form-input id="title" v-model="title" placeholder="Title" />
            </b-form-group>
          </div>
        </b-col>
        <b-col md="3">
          <b-form-group label="Search Type" label-for="searchType">
            <v-select
              id="searchType"
              v-model="searchType"
              :options="searchTypes"
              placeholder="Search Type"
              label="name"
            />
          </b-form-group>
        </b-col>
        <b-col md="2">
          <b-button variant="primary" pill @click="search">
            <feather-icon icon="SearchIcon" class="mr-50" />
            <span class="align-middle">Search</span>
          </b-button>
        </b-col>
      </b-row>
      <b-table
        responsive
        :fields="fields"
        :items="contracts"
        details-td-class="m-0 p-0"
        small
        v-if="hasPermission('read_contract')"
        :per-page="0"
      >
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
          {{ row.item.poc ? row.item.poc.full_name : "" }}
        </template>
        <template #cell(issue_date)="row">
          {{ formatDate(row.item.issue_date) }}
        </template>
        <template #cell(expiry_date)="row">
          {{ formatDate(row.item.expiry_date) }}
        </template>
        <template #cell(inactive_date)="row">
          {{ formatDate(row.item.inactive_date) }}
        </template>
        <template #cell(expiry_timezone)="row">
          {{
            row.item.expiry_timezone_display || row.item.expiry_timezone || "-"
          }}
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
            variant="info"
            pill
            size="sm"
            class="mr-50"
            @click="editContract(row.item)"
            v-if="hasPermission('update_contract')"
          >
            Edit
          </b-button>
          <b-button
            variant="danger"
            pill
            size="sm"
            class="mr-50"
            @click="removeContract(row.item)"
            v-if="hasPermission('delete_contract')"
          >
            Delete
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
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import VueSelectPaginated from "@/components/ui/VueSelectPaginated.vue";
import CreateContractModal from "@/components/contract/CreateContractModal.vue";
import EditContractModal from "@/components/contract/EditContractModal.vue";

import util from "@/util.js";

export default {
  components: {
    CreateContractModal,
    EditContractModal,
    VueSelectPaginated,
  },
  data() {
    return {
      fields: [
        { key: "notice_id", label: "Notice ID" },
        { key: "title", label: "Title" },
        { key: "company", label: "Company" },
        { key: "contract_status", label: "Status" },
        { key: "poc", label: "POC" },
        { key: "manufacturer_name", label: "Manufacturer" },
        { key: "manufacturer_email", label: "Manufacturer Email" },
        { key: "issue_date", label: "Issue Date" },
        { key: "expiry_date", label: "Expiry Date" },
        { key: "expiry_timezone", label: "Timezone" },
        { key: "inactive_date", label: "Inactive Date" },
        { key: "submitted_at", label: "Submitted At" },
        { key: "awarded_at", label: "Awarded At" },
        { key: "notes", label: "Notes" },
        { key: "contract_link", label: "Contract Link" },
        { key: "manage", label: "Manage" },
      ],
      currentPage: 1,
      perPage: 0,
      totalItems: 0,
      contracts: [],
      contract: null,
      editContractModalCount: 0,
      createContractModalCount: 0,
      searchTypes: [
        { value: 1, name: "Notice ID" },
        { value: 2, name: "Title" },
      ],
      searchType: null,
      noticeId: "",
      title: "",
    };
  },
  mixins: [util],
  created() {
    this.searchType = this.searchTypes[0];
  },
  async mounted() {
    await this.fetchPaginatedData();
  },
  methods: {
    ...mapActions({
      getContracts: "appData/getContracts",
      deleteContract: "appData/deleteContract",
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
    async search() {
      if (this.searchType) {
        switch (this.searchType.value) {
          case 1:
            this.title = "";
            break;
          case 2:
            this.noticeId = "";
            break;
        }
      } else {
        this.noticeId = "";
        this.title = "";
      }
      this.currentPage = 1;
      await this.fetchPaginatedData();
    },
    async fetchPaginatedData() {
      try {
        const res = await this.getContracts({
          pageNumber: this.currentPage,
          notice_id: this.noticeId,
          title: this.title,
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
    editContract(contract) {
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
  },
  computed: {
    ...mapGetters({
      hasPermission: "appData/hasPermission",
    }),
  },
  watch: {
    currentPage: async function (val) {
      await this.fetchPaginatedData();
    },
  },
};
</script>

<style></style>
