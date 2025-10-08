<template>
  <b-modal
    id="create-contract-status-modal"
    centered
    size="lg"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true"
    dialog-class="my-dialog-class"
  >
    <template #modal-title>
      <h2 class="m-0 text-primary">Create Contract Status</h2>
    </template>
    <validation-observer ref="createContractStatusFormValidation">
      <b-form @submit.prevent>
        <b-form-row>
          <b-col md="6">
            <b-form-group label-for="name">
              <template #label>
                Name <span class="text-danger">*</span>
              </template>
              <validation-provider
                #default="{ errors }"
                name="Name"
                :rules="{ required }"
              >
                <b-form-input
                  id="name"
                  v-model="name"
                  :state="errors.length > 0 ? false : null"
                  placeholder="Name"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label-for="color">
              <template #label>
                Color <span class="text-danger">*</span>
              </template>
              <validation-provider
                #default="{ errors }"
                name="Color"
                :rules="{ required }"
              >
                <b-form-input
                  id="color"
                  v-model="color"
                  type="color"
                  :state="errors.length > 0 ? false : null"
                  placeholder="Color"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
        </b-form-row>
        <b-form-row>
          <b-col md="12">
            <b-form-group label-for="description">
              <template #label>
                Description <span class="text-danger">*</span>
              </template>
              <validation-provider
                #default="{ errors }"
                name="Description"
                :rules="{ required }"
              >
                <b-form-textarea
                  id="description"
                  v-model="description"
                  :state="errors.length > 0 ? false : null"
                  placeholder="Description"
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
import { required } from "@validations";
import util from "@/util.js";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  mixins: [util],
  data() {
    return {
      name: "",
      description: "",
      color: "#007bff",
      required,
    };
  },
  async mounted() {},
  methods: {
    ...mapActions({
      createContractStatus: "appData/createContractStatus",
    }),
    async validationForm() {
      const success =
        await this.$refs.createContractStatusFormValidation.validate();
      if (success) {
        await this.submit();
      }
    },
    async submit() {
      try {
        const res = await this.createContractStatus({
          name: this.name,
          description: this.description,
          color: this.color,
          created_by: this.getLoggedInUser.id,
          updated_by: this.getLoggedInUser.id,
        });
        if (res.status === 200) {
          this.$swal({
            title: "Contract Status created successfully",
            icon: "success",
          });
          this.$nextTick(() => {
            this.$bvModal.hide("create-contract-status-modal");
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
