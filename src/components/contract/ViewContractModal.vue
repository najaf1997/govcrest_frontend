<template>
  <b-modal
    id="view-contract-modal"
    centered
    size="xl"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true"
    hide-footer
    dialog-class="my-dialog-class"
  >
    <template #modal-title>
      <div class="d-flex align-items-center">
        <feather-icon
          icon="FileTextIcon"
          size="24"
          class="mr-75 text-primary"
        />
        <h2 class="m-0 text-primary">Contract Details</h2>
      </div>
    </template>

    <div v-if="contract">
      <!-- Header Card with Notice ID and Title -->
      <b-card class="mb-50 border-primary shadow-sm bg-primary">
        <b-row>
          <b-col cols="12" md="6">
            <div class="d-flex align-items-start">
              <feather-icon
                icon="HashIcon"
                size="18"
                class="mr-50 text-light mt-25"
              />
              <div>
                <small class="text-light d-block">Notice ID</small>
                <h4 class="mb-0 font-weight-bolder text-light">
                  {{ contract.notice_id }}
                </h4>
              </div>
            </div>
          </b-col>
          <b-col cols="12" md="6">
            <div class="d-flex align-items-start">
              <feather-icon
                icon="FileIcon"
                size="18"
                class="mr-50 text-light mt-25"
              />
              <div>
                <small class="text-light d-block">Title</small>
                <h5 class="mb-0 font-weight-bolder text-light">
                  {{ contract.title }}
                </h5>
              </div>
            </div>
          </b-col>
        </b-row>

        <!-- Status Badge -->
        <b-row class="mt-50" v-if="contract.contract_status">
          <b-col cols="12">
            <b-badge
              pill
              :style="{
                backgroundColor: contract.contract_status.color,
                color: getContrastColor(contract.contract_status.color),
                fontSize: '0.95rem',
                padding: '0.5rem 1.5rem',
              }"
            >
              <feather-icon icon="ActivityIcon" size="14" class="mr-50" />
              {{ contract.contract_status.name }}
            </b-badge>
          </b-col>
        </b-row>
      </b-card>

      <!-- Main Information Cards -->
      <b-row>
        <!-- Company & Contact Information -->
        <b-col cols="12" lg="6">
          <b-card class="shadow-sm h-100">
            <template #header>
              <div class="d-flex align-items-center">
                <feather-icon
                  icon="BriefcaseIcon"
                  size="18"
                  class="mr-50 text-success"
                />
                <h5 class="mb-0 font-weight-bolder text-primary">
                  Company & Contact
                </h5>
              </div>
            </template>

            <b-list-group flush>
              <b-list-group-item
                class="d-flex justify-content-between align-items-start px-0 border-0"
              >
                <div class="d-flex align-items-center">
                  <feather-icon
                    icon="MonitorIcon"
                    size="16"
                    class="mr-75 text-dark"
                  />
                  <span class="text-dark">Company:</span>
                </div>
                <strong class="text-right">{{
                  contract.company ? contract.company.name : "-"
                }}</strong>
              </b-list-group-item>

              <b-list-group-item
                class="d-flex justify-content-between align-items-start px-0 border-0"
              >
                <div class="d-flex align-items-center">
                  <feather-icon
                    icon="UserIcon"
                    size="16"
                    class="mr-75 text-dark"
                  />
                  <span class="text-dark">Point of Contact:</span>
                </div>
                <div class="text-right">
                  <div
                    v-if="
                      contract.poc &&
                      Array.isArray(contract.poc) &&
                      contract.poc.length > 0
                    "
                  >
                    <b-badge
                      v-for="user in contract.poc"
                      :key="user.id"
                      variant="primary"
                      class="mr-1 mb-1"
                    >
                      {{ user.full_name }}
                    </b-badge>
                  </div>
                  <strong
                    v-else-if="contract.poc && !Array.isArray(contract.poc)"
                  >
                    {{ contract.poc.full_name }}
                  </strong>
                  <strong v-else>-</strong>
                </div>
              </b-list-group-item>

              <b-list-group-item
                class="d-flex justify-content-between align-items-start px-0 border-0"
              >
                <div class="d-flex align-items-center">
                  <feather-icon
                    icon="MailIcon"
                    size="16"
                    class="mr-75 text-dark"
                  />
                  <span class="text-dark">POC Email:</span>
                </div>
                <div class="text-right">
                  <div
                    v-if="
                      contract.poc &&
                      Array.isArray(contract.poc) &&
                      contract.poc.length > 0
                    "
                  >
                    <div
                      v-for="user in contract.poc"
                      :key="user.id"
                      class="mb-1"
                    >
                      <strong>{{ user.email || "-" }}</strong>
                    </div>
                  </div>
                  <strong
                    v-else-if="contract.poc && !Array.isArray(contract.poc)"
                  >
                    {{ contract.poc.email || "-" }}
                  </strong>
                  <strong v-else>-</strong>
                </div>
              </b-list-group-item>
            </b-list-group>
          </b-card>
        </b-col>

        <!-- Dates Information -->
        <b-col cols="12" lg="6">
          <b-card class="mb-0 shadow-sm h-100">
            <template #header>
              <div class="d-flex align-items-center">
                <feather-icon
                  icon="CalendarIcon"
                  size="18"
                  class="mr-50 text-warning"
                />
                <h5 class="mb-0 font-weight-bold">Important Dates</h5>
              </div>
            </template>

            <b-list-group flush>
              <b-list-group-item
                class="d-flex justify-content-between align-items-start px-0 border-0"
              >
                <div class="d-flex align-items-center">
                  <feather-icon
                    icon="PlayCircleIcon"
                    size="16"
                    class="mr-75 text-dark"
                  />
                  <span class="text-dark">Issue Date:</span>
                </div>
                <strong class="text-dark">{{
                  formatDate(contract.issue_date)
                }}</strong>
              </b-list-group-item>

              <b-list-group-item
                class="d-flex justify-content-between align-items-start px-0 border-0"
              >
                <div class="d-flex align-items-center">
                  <feather-icon
                    icon="AlertCircleIcon"
                    size="16"
                    class="mr-75 text-dark"
                  />
                  <span class="text-dark">Expiry Date:</span>
                </div>
                <strong
                  class="text-right"
                  :class="isExpiringSoon() ? 'text-danger' : ''"
                >
                  {{ formatDate(contract.expiry_date) }}
                </strong>
              </b-list-group-item>

              <b-list-group-item
                class="d-flex justify-content-between align-items-start px-0 border-0"
              >
                <div class="d-flex align-items-center">
                  <feather-icon
                    icon="GlobeIcon"
                    size="16"
                    class="mr-75 text-dark"
                  />
                  <span class="text-dark">Timezone:</span>
                </div>
                <strong class="text-right">{{
                  contract.expiry_timezone_display ||
                  contract.expiry_timezone ||
                  "-"
                }}</strong>
              </b-list-group-item>

              <b-list-group-item
                class="d-flex justify-content-between align-items-start px-0 border-0"
              >
                <div class="d-flex align-items-center">
                  <feather-icon
                    icon="XCircleIcon"
                    size="16"
                    class="mr-75 text-dark"
                  />
                  <span class="text-dark">Inactive Date:</span>
                </div>
                <strong class="text-right">{{
                  formatDate(contract.inactive_date)
                }}</strong>
              </b-list-group-item>

              <b-list-group-item
                class="d-flex justify-content-between align-items-start px-0 border-0"
              >
                <div class="d-flex align-items-center">
                  <feather-icon
                    icon="SendIcon"
                    size="16"
                    class="mr-75 text-dark"
                  />
                  <span class="text-dark">Submitted At:</span>
                </div>
                <strong class="text-right">{{
                  formatDate(contract.submitted_at)
                }}</strong>
              </b-list-group-item>

              <b-list-group-item
                class="d-flex justify-content-between align-items-start px-0 border-0"
              >
                <div class="d-flex align-items-center">
                  <feather-icon
                    icon="AwardIcon"
                    size="16"
                    class="mr-75 text-dark"
                  />
                  <span class="text-dark">Awarded At:</span>
                </div>
                <strong class="text-right">{{
                  formatDate(contract.awarded_at)
                }}</strong>
              </b-list-group-item>
            </b-list-group>
          </b-card>
        </b-col>
      </b-row>

      <!-- Manufacturer Information -->
      <b-card
        class="mb-1 shadow-sm"
        v-if="contract.manufacturer_name || contract.manufacturer_email"
      >
        <template #header>
          <div class="d-flex align-items-center">
            <feather-icon
              icon="PackageIcon"
              size="18"
              class="mr-50 text-danger"
            />
            <h5 class="mb-0 font-weight-bolder">Manufacturer Information</h5>
          </div>
        </template>

        <b-row>
          <b-col cols="12" md="6">
            <b-list-group-item
              class="d-flex justify-content-between align-items-start px-0 border-0"
            >
              <div class="d-flex align-items-center">
                <feather-icon
                  icon="TagIcon"
                  size="16"
                  class="mr-75 text-dark"
                />
                <span class="text-dark">Manufacturer Name:</span>
              </div>
              <strong class="text-right">{{
                contract.manufacturer_name || "-"
              }}</strong>
            </b-list-group-item>
          </b-col>
          <b-col cols="12" md="6">
            <b-list-group-item
              class="d-flex justify-content-between align-items-start px-0 border-0"
            >
              <div class="d-flex align-items-center">
                <feather-icon
                  icon="MailIcon"
                  size="16"
                  class="mr-75 text-dark"
                />
                <span class="text-dark">Manufacturer Email:</span>
              </div>
              <strong class="text-right">{{
                contract.manufacturer_email || "-"
              }}</strong>
            </b-list-group-item>
          </b-col>
        </b-row>
      </b-card>

      <!-- Contract Link -->
      <b-card class="shadow-sm" v-if="contract.contract_link">
        <template #header>
          <div class="d-flex align-items-center">
            <feather-icon icon="LinkIcon" size="18" class="mr-50 text-info" />
            <h5 class="mb-0 font-weight-bold">Contract Link</h5>
          </div>
        </template>

        <div class="d-flex align-items-center">
          <a
            :href="contract.contract_link"
            target="_blank"
            class="btn btn-outline-primary btn-block d-flex align-items-center justify-content-center"
          >
            <feather-icon icon="ExternalLinkIcon" size="16" class="mr-50" />
            Open Contract Document
          </a>
        </div>
      </b-card>

      <!-- Notes -->
      <b-card class="shadow-sm" v-if="contract.notes">
        <template #header>
          <div class="d-flex align-items-center">
            <feather-icon
              icon="FileTextIcon"
              size="18"
              class="mr-50 text-dark"
            />
            <h5 class="mb-0 font-weight-bolder text-primary">Notes</h5>
          </div>
        </template>

        <p class="mb-0 text-justify" style="white-space: pre-wrap">
          {{ contract.notes }}
        </p>
      </b-card>

      <!-- Action Buttons -->
      <div class="d-flex justify-content-end mt-1">
        <b-button
          variant="outline-secondary"
          pill
          @click="closeModal"
          class="mr-1"
        >
          <feather-icon icon="XIcon" size="16" class="mr-50" />
          Close
        </b-button>
        <b-button
          variant="info"
          pill
          @click="editContract"
          v-if="
            hasPermission('update_contract') &&
            (hasRole('su') ||
              hasRole('ca') ||
              (hasRole('emp') &&
                this.contract.poc &&
                getLoggedInUser &&
                ((Array.isArray(this.contract.poc) &&
                  this.contract.poc.some(
                    (poc) => poc.id === getLoggedInUser.id
                  )) ||
                  (!Array.isArray(this.contract.poc) &&
                    this.contract.poc.id === getLoggedInUser.id))))
          "
          class="mr-1"
        >
          <feather-icon icon="EditIcon" size="16" class="mr-50" />
          Edit
        </b-button>
        <b-button
          variant="danger"
          pill
          @click="deleteContract"
          v-if="
            hasPermission('delete_contract') &&
            (hasRole('su') ||
              hasRole('ca') ||
              (hasRole('emp') &&
                this.contract.poc &&
                getLoggedInUser &&
                ((Array.isArray(this.contract.poc) &&
                  this.contract.poc.some(
                    (poc) => poc.id === getLoggedInUser.id
                  )) ||
                  (!Array.isArray(this.contract.poc) &&
                    this.contract.poc.id === getLoggedInUser.id))))
          "
        >
          <feather-icon icon="TrashIcon" size="16" class="mr-50" />
          Delete
        </b-button>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";

export default {
  props: {
    contract: Object,
  },
  methods: {
    getContrastColor(hexColor) {
      if (!hexColor) return "#000000";
      const hex = hexColor.replace("#", "");
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5 ? "#000000" : "#ffffff";
    },
    formatDate(dateString) {
      if (!dateString) return "-";
      return moment(dateString).format("MMM DD, YYYY");
    },
    formatDateTime(dateString) {
      if (!dateString) return "-";
      return moment(dateString).format("MMM DD, YYYY hh:mm A");
    },
    isExpiringSoon() {
      if (!this.contract.expiry_date) return false;
      const expiryDate = new Date(this.contract.expiry_date);
      const today = new Date();
      const daysUntilExpiry = Math.ceil(
        (expiryDate - today) / (1000 * 60 * 60 * 24)
      );
      return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
    },
    closeModal() {
      this.$bvModal.hide("view-contract-modal");
    },
    editContract() {
      this.$bvModal.hide("view-contract-modal");
      this.$emit("edit-contract", this.contract);
    },
    deleteContract() {
      this.$bvModal.hide("view-contract-modal");
      this.$emit("delete-contract", this.contract);
    },
  },
  computed: {
    ...mapGetters({
      hasPermission: "appData/hasPermission",
      hasRole: "appData/hasRole",
      getLoggedInUser: "appData/getLoggedInUser",
    }),
  },
};
</script>

<style scoped>
/* Minimal custom styles for enhanced readability */
</style>
