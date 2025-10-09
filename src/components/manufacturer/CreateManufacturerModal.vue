<template>
  <b-modal
    id="create-manufacturer-modal"
    centered
    size="lg"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true"
    dialog-class="my-dialog-class"
  >
    <template #modal-title>
      <h2 class="m-0 text-primary">Create Manufacturer</h2>
    </template>
    <validation-observer ref="createManufacturerFormValidation">
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
                :rules="{ required, regex: /^[A-Z\s]*$/i }"
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
            <VueSelectPaginated
              placeholder="Category"
              name="Category"
              label="name"
              searchBy="name"
              :getListMethod="getManufacturerCategories"
              @setMethod="
                (value) => {
                  category = value;
                }
              "
            />
          </b-col>
        </b-form-row>
        <b-form-row>
          <b-col md="6">
            <b-form-group label-for="email">
              <template #label> Email </template>
              <validation-provider
                #default="{ errors }"
                name="Email"
                rules="email"
              >
                <b-form-input
                  id="email"
                  v-model="email"
                  :state="errors.length > 0 ? false : null"
                  placeholder="Email"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label-for="phone">
              <template #label> Phone </template>
              <validation-provider #default="{ errors }" name="Phone">
                <b-form-input
                  id="phone"
                  v-model="phone"
                  :state="errors.length > 0 ? false : null"
                  placeholder="Phone"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
        </b-form-row>
        <b-form-row>
          <b-col md="12">
            <b-form-group label-for="link">
              <template #label> Website Link </template>
              <validation-provider #default="{ errors }" name="Website Link">
                <b-form-input
                  id="link"
                  v-model="link"
                  :state="errors.length > 0 ? false : null"
                  placeholder="Website Link"
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

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    VueSelectPaginated,
  },
  mixins: [util],
  data() {
    return {
      name: "",
      email: "",
      phone: "",
      link: "",
      category: null,
      required,
    };
  },
  methods: {
    ...mapActions({
      createManufacturer: "appData/createManufacturer",
      getManufacturerCategories: "appData/getManufacturerCategories",
    }),
    async validationForm() {
      const success =
        await this.$refs.createManufacturerFormValidation.validate();
      if (success) {
        await this.submit();
      }
    },
    async submit() {
      try {
        const payload = {
          name: this.name,
          email: this.email || null,
          phone: this.phone || null,
          link: this.link || null,
          created_by: this.getLoggedInUser.id,
          updated_by: this.getLoggedInUser.id,
        };

        if (this.category) {
          payload.category = this.category.id;
        }

        const res = await this.createManufacturer(payload);
        if (res.status === 200) {
          this.$swal({
            title: "Manufacturer created successfully",
            icon: "success",
          });
          this.$nextTick(() => {
            this.$bvModal.hide("create-manufacturer-modal");
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
