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
                  type="date"
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
                  type="date"
                  :state="errors.length > 0 ? false : null"
                />
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
                  type="date"
                  :state="errors.length > 0 ? false : null"
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
          <b-col md="6">
            <VueSelectPaginated
              placeholder="Point of Contact"
              name="POC"
              label="username"
              searchBy="username"
              :getListMethod="getUsers"
              @setMethod="
                (value) => {
                  poc = value;
                }
              "
            />
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

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    VueSelectPaginated,
  },
  mixins: [util],
  data() {
    return {
      noticeId: "",
      title: "",
      issueDate: "",
      expiryDate: "",
      contractLink: "",
      inactiveDate: "",
      contractStatus: null,
      poc: null,
      required,
    };
  },
  methods: {
    ...mapActions({
      createContract: "appData/createContract",
      getContractStatuses: "appData/getContractStatuses",
      getUsers: "appData/getUsers",
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
          expiry_date: this.expiryDate || null,
          contract_link: this.contractLink,
          inactive_date: this.inactiveDate || null,
          created_by: this.getLoggedInUser.id,
          updated_by: this.getLoggedInUser.id,
        };

        if (this.contractStatus) {
          payload.contract_status = this.contractStatus.id;
        }
        if (this.poc) {
          payload.poc = this.poc.id;
        }

        const res = await this.createContract(payload);
        if (res.status === 200) {
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
    ...mapGetters({ getLoggedInUser: "appData/getLoggedInUser" }),
  },
};
</script>

<style scoped></style>
