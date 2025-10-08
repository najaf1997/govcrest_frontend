<template>
  <div>
    <div class="text-right mb-1">
      <b-button
        variant="primary"
        pill
        @click="createContractStatus"
        v-if="hasPermission('create_contract_status')"
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
              label="Name"
              label-for="name"
              class="w-50"
              v-if="searchType.value === 1"
            >
              <b-input-group>
                <template #prepend> </template>
              </b-input-group>
              <b-form-input id="name" v-model="name" placeholder="Name" />
            </b-form-group>
            <b-form-group
              label="Description"
              label-for="description"
              class="w-50"
              v-if="searchType.value === 2"
            >
              <b-form-input
                id="description"
                v-model="description"
                placeholder="Description"
              />
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
        responsive="sm"
        :fields="fields"
        :items="contractStatuses"
        details-td-class="m-0 p-0"
        small
        v-if="hasPermission('read_contract_status')"
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
        <template #cell(color)="row">
          <span
            class="badge badge-pill"
            :style="{
              backgroundColor: row.item.color,
              color: getContrastColor(row.item.color),
            }"
          >
            {{ row.item.name }}
          </span>
        </template>
        <template #cell(manage)="row">
          <b-button
            variant="info"
            pill
            size="sm"
            class="mr-50"
            @click="editContractStatus(row.item)"
            v-if="hasPermission('update_contract_status')"
          >
            Edit
          </b-button>
          <b-button
            variant="danger"
            pill
            size="sm"
            class="mr-50"
            @click="removeContractStatus(row.item)"
            v-if="hasPermission('delete_contract_status')"
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
    <CreateContractStatusModal
      @modalClosed="onModalClosed"
      :key="`create-${createContractStatusModalCount}`"
    />
    <EditContractStatusModal
      :contractStatus="contractStatus"
      @modalClosed="onModalClosed"
      :key="`edit-${editContractStatusModalCount}`"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import VueSelectPaginated from "@/components/ui/VueSelectPaginated.vue";
import CreateContractStatusModal from "@/components/contract-status/CreateContractStatusModal.vue";
import EditContractStatusModal from "@/components/contract-status/EditContractStatusModal.vue";

import util from "@/util.js";

export default {
  components: {
    CreateContractStatusModal,
    EditContractStatusModal,
    VueSelectPaginated,
  },
  data() {
    return {
      fields: [
        { key: "name", label: "Name" },
        { key: "description", label: "Description" },
        { key: "color", label: "Color" },
        { key: "manage", label: "Manage" },
      ],
      currentPage: 1,
      perPage: 0,
      totalItems: 0,
      contractStatuses: [],
      contractStatus: null,
      editContractStatusModalCount: 0,
      createContractStatusModalCount: 0,
      searchTypes: [
        { value: 1, name: "Name" },
        { value: 2, name: "Description" },
      ],
      searchType: null,
      name: "",
      description: "",
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
      getContractStatuses: "appData/getContractStatuses",
      deleteContractStatus: "appData/deleteContractStatus",
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
    async search() {
      if (this.searchType) {
        switch (this.searchType.value) {
          case 1:
            this.description = "";
            break;
          case 2:
            this.name = "";
            break;
        }
      } else {
        this.name = "";
        this.description = "";
      }
      this.currentPage = 1;
      await this.fetchPaginatedData();
    },
    async fetchPaginatedData() {
      try {
        const res = await this.getContractStatuses({
          pageNumber: this.currentPage,
          name: this.name,
          description: this.description,
        });
        this.contractStatuses = res.data.results;
        this.totalItems = res.data.count;
        this.perPage = res.data.per_page;
      } catch (error) {
        this.displayError(error);
      }
    },
    createContractStatus() {
      this.createContractStatusModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("create-contract-status-modal");
      });
    },
    editContractStatus(contractStatus) {
      this.contractStatus = contractStatus;
      this.editContractStatusModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("edit-contract-status-modal");
      });
    },
    async removeContractStatus(contractStatus) {
      this.contractStatus = contractStatus;

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
            const res = await this.deleteContractStatus({
              pk: this.contractStatus.id,
            });
            if (res.status === 200) {
              this.$swal({
                title: "Contract Status deleted successfully",
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
