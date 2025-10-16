<template>
  <b-modal
    id="create-contract-modal"
    centered
    size="lg"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true"
    dialog-class="my-dialog-class"
  >
    <template #modal-title>
      <h2 class="m-0 text-primary">Create Contract</h2>
    </template>
    <validation-observer ref="createContractFormValidation">
      <b-form @submit.prevent>
        <b-form-row>
          <b-col md="6">
            <b-form-group label-for="noticeId">
              <template #label>
                Notice ID <span class="text-danger">*</span>
              </template>
              <validation-provider
                #default="{ errors }"
                name="Notice ID"
                :rules="{ required }"
              >
                <b-form-input
                  id="noticeId"
                  v-model="noticeId"
                  :state="errors.length > 0 ? false : null"
                  placeholder="Notice ID"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label-for="title">
              <template #label>
                Title <span class="text-danger">*</span>
              </template>
              <validation-provider
                #default="{ errors }"
                name="Title"
                :rules="{ required }"
              >
                <b-form-input
                  id="title"
                  v-model="title"
                  :state="errors.length > 0 ? false : null"
                  placeholder="Title"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
        </b-form-row>
        <b-form-row>
          <b-col md="6">
            <b-form-group label-for="issueDate">
              <template #label> Issue Date </template>
              <validation-provider #default="{ errors }" name="Issue Date">
                <b-form-input
                  id="issueDate"
                  v-model="issueDate"
                  type="datetime-local"
                  :state="errors.length > 0 ? false : null"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label-for="expiryDate">
              <template #label> Expiry Date </template>
              <validation-provider #default="{ errors }" name="Expiry Date">
                <b-form-input
                  id="expiryDate"
                  v-model="expiryDate"
                  type="datetime-local"
                  :state="errors.length > 0 ? false : null"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
        </b-form-row>
        <b-form-row v-if="expiryDate">
          <b-col md="6">
            <b-form-group label-for="expiryTimezone">
              <template #label>
                Expiry Timezone <span class="text-danger">*</span>
              </template>
              <validation-provider
                #default="{ errors }"
                name="Expiry Timezone"
                :rules="{ required }"
              >
                <v-select
                  id="expiryTimezone"
                  v-model="expiryTimezone"
                  :options="timezoneOptions"
                  label="label"
                  :reduce="(option) => option.value"
                  placeholder="Select Timezone"
                  :state="errors.length > 0 ? false : null"
                >
                  <template #no-options>No timezones found.</template>
                </v-select>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
        </b-form-row>
        <b-form-row>
          <b-col md="6">
            <b-form-group label-for="contractLink">
              <template #label> Contract Link </template>
              <validation-provider #default="{ errors }" name="Contract Link">
                <b-form-input
                  id="contractLink"
                  v-model="contractLink"
                  :state="errors.length > 0 ? false : null"
                  placeholder="Contract Link"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label-for="inactiveDate">
              <template #label> Inactive Date </template>
              <validation-provider #default="{ errors }" name="Inactive Date">
                <b-form-input
                  id="inactiveDate"
                  v-model="inactiveDate"
                  type="datetime-local"
                  :state="errors.length > 0 ? false : null"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
        </b-form-row>
        <b-form-row>
          <b-col md="6">
            <b-form-group label-for="manufacturerName">
              <template #label> Manufacturer Name </template>
              <validation-provider
                #default="{ errors }"
                name="Manufacturer Name"
              >
                <b-form-input
                  id="manufacturerName"
                  v-model="manufacturerName"
                  :state="errors.length > 0 ? false : null"
                  placeholder="Manufacturer Name"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label-for="manufacturerEmail">
              <template #label> Manufacturer Email </template>
              <validation-provider
                #default="{ errors }"
                name="Manufacturer Email"
              >
                <b-form-input
                  id="manufacturerEmail"
                  v-model="manufacturerEmail"
                  type="email"
                  :state="errors.length > 0 ? false : null"
                  placeholder="Manufacturer Email"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
        </b-form-row>
        <b-form-row>
          <b-col md="6">
            <VueSelectPaginated
              placeholder="Contract Status"
              name="Contract Status"
              label="name"
              searchBy="name"
              :getListMethod="getContractStatuses"
              @setMethod="
                (value) => {
                  contractStatus = value;
                }
              "
            />
          </b-col>
          <b-col md="6" v-if="!hasRole('emp')">
            <VueSelectPaginated
              placeholder="Point of Contact"
              name="POC"
              label="full_name"
              searchBy="full_name"
              :getListMethod="getUsers"
              @setMethod="
                (value) => {
                  poc = value;
                }
              "
            />
          </b-col>
        </b-form-row>
        <b-form-row>
          <b-col md="6">
            <VueSelectPaginated
              placeholder="Company"
              name="Company"
              label="name"
              searchBy="name"
              :getListMethod="getCompanys"
              @setMethod="
                (value) => {
                  company = value;
                }
              "
            />
          </b-col>
        </b-form-row>
        <b-form-row>
          <b-col md="12">
            <b-form-group label-for="notes">
              <template #label> Notes </template>
              <validation-provider #default="{ errors }" name="Notes">
                <b-form-textarea
                  id="notes"
                  v-model="notes"
                  :state="errors.length > 0 ? false : null"
                  placeholder="Add any notes here..."
                  rows="3"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
        </b-form-row>
      </b-form>
    </validation-observer>
    <template #modal-footer>
      <b-form-group class="text-right">
        <b-button type="submit" variant="primary" pill @click="validationForm">
          Submit
        </b-button>
      </b-form-group>
    </template>
  </b-modal>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import VueSelectPaginated from "@/components/ui/VueSelectPaginated.vue";
import { required } from "@validations";
import util from "@/util.js";
import { TIMEZONE_CHOICES } from "@/utils/timezones.js";
import vSelect from "vue-select";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    VueSelectPaginated,
    vSelect,
  },
  mixins: [util],
  data() {
    return {
      noticeId: "",
      title: "",
      issueDate: "",
      expiryDate: "",
      expiryTimezone: "America/New_York",
      contractLink: "",
      inactiveDate: "",
      manufacturerName: "",
      manufacturerEmail: "",
      notes: "",
      contractStatus: null,
      poc: null,
      company: null,
      required,
      timezoneOptions: TIMEZONE_CHOICES,
    };
  },
  methods: {
    ...mapActions({
      createContract: "appData/createContract",
      getContractStatuses: "appData/getContractStatuses",
      getUsers: "appData/getUsers",
      getCompanys: "appData/getCompanys",
    }),
    async validationForm() {
      const success = await this.$refs.createContractFormValidation.validate();
      if (success) {
        await this.submit();
      }
    },
    async submit() {
      try {
        const payload = {
          notice_id: this.noticeId,
          title: this.title,
          issue_date: this.issueDate || null,
          contract_link: this.contractLink,
          inactive_date: this.inactiveDate || null,
          manufacturer_name: this.manufacturerName || null,
          manufacturer_email: this.manufacturerEmail || null,
          notes: this.notes || null,
          company: this.company.id,
          created_by: this.getLoggedInUser.id,
          updated_by: this.getLoggedInUser.id,
        };

        // Handle expiry date with timezone
        if (this.expiryDate) {
          // Format: "YYYY-MM-DD HH:MM:SS|TIMEZONE"
          const formattedDate = this.expiryDate.replace("T", " ") + ":00";
          payload.expiry_date_with_timezone = `${formattedDate}|${this.expiryTimezone}`;
        }

        if (this.contractStatus) {
          payload.contract_status = this.contractStatus.id;
        }
        if (this.poc) {
          payload.poc = this.poc.id;
        }

        const res = await this.createContract(payload);
        if (res.status === 200 || res.status === 201) {
          this.$swal({
            title: "Contract created successfully",
            icon: "success",
          });
          this.$nextTick(() => {
            this.$bvModal.hide("create-contract-modal");
          });
          this.$emit("modalClosed");
        }
      } catch (error) {
        this.displayError(error);
      }
    },
  },
  computed: {
    ...mapGetters({
      hasRole: "appData/hasRole",
      getLoggedInUser: "appData/getLoggedInUser",
    }),
  },
};
</script>

<style scoped></style>
