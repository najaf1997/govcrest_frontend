<template>
  <b-modal
    id="create-user-modal"
    centered
    size="lg"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true"
    dialog-class="my-dialog-class"
  >
    <template #modal-title> <h2 class="m-0">Create User</h2> </template>
    <validation-observer ref="createUserFormValidation">
      <b-form @submit.prevent>
        <b-form-row>
          <b-col md="6">
            <b-form-group label-for="username">
              <template #label>
                Username <span class="text-danger">*</span>
              </template>
              <validation-provider
                #default="{ errors }"
                name="Username"
                :rules="{ required, regex: /^[A-Z0-9]*$/i }"
              >
                <b-form-input
                  id="username"
                  v-model="username"
                  :state="errors.length > 0 ? false : null"
                  placeholder="Username"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label-for="password">
              <template #label>
                Password <span class="text-danger">*</span>
              </template>
              <validation-provider
                #default="{ errors }"
                name="Password"
                rules="required"
              >
                <b-input-group
                  class="input-group-merge"
                  :class="errors.length > 0 ? 'is-invalid' : null"
                >
                  <b-form-input
                    id="password"
                    v-model="password"
                    :state="errors.length > 0 ? false : null"
                    class="form-control-merge"
                    :type="passwordFieldType"
                    name="password"
                    placeholder="············"
                  />
                  <b-input-group-append is-text>
                    <feather-icon
                      class="cursor-pointer"
                      :icon="passwordToggleIcon"
                      @click="togglePasswordVisibility"
                    />
                  </b-input-group-append>
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
        </b-form-row>
        <b-form-row>
          <b-col md="6">
            <b-form-group label-for="firstName">
              <template #label>
                First Name <span class="text-danger">*</span>
              </template>
              <validation-provider
                #default="{ errors }"
                name="First Name"
                :rules="{ required }"
              >
                <b-form-input
                  id="firstName"
                  v-model="firstName"
                  :state="errors.length > 0 ? false : null"
                  placeholder="First Name"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label-for="lastName">
              <template #label>
                Last Name <span class="text-danger">*</span>
              </template>
              <validation-provider
                #default="{ errors }"
                name="Last Name"
                :rules="{ required }"
              >
                <b-form-input
                  id="lastName"
                  v-model="lastName"
                  :state="errors.length > 0 ? false : null"
                  placeholder="Last Name"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
        </b-form-row>
        <b-form-row>
          <b-col md="6">
            <b-form-group label-for="mobile">
              <template #label>
                Mobile <span class="text-danger">*</span>
              </template>
              <validation-provider
                #default="{ errors }"
                name="Mobile"
                rules="required|integer|length:11"
              >
                <b-form-input
                  id="mobile"
                  v-model="mobile"
                  :state="errors.length > 0 ? false : null"
                  placeholder="Mobile"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label-for="email">
              <template #label>
                Email <span class="text-danger">*</span>
              </template>
              <validation-provider
                #default="{ errors }"
                name="Email"
                rules="required|email"
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
        </b-form-row>
        <b-form-row>
          <b-col md="6">
            <VueSelectPaginated
              placeholder="Role"
              name="Role"
              label="name"
              rules="required"
              searchBy="name"
              :getListMethod="getRoles"
              @setMethod="
                (value) => {
                  role = value;
                }
              "
            />
          </b-col>
          <b-col md="6">
            <VueSelectPaginated
              placeholder="Company"
              name="Company"
              label="name"
              rules="required"
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
import { togglePasswordVisibility } from "@core/mixins/ui/forms";
import util from "@/util.js";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    VueSelectPaginated,
  },
  mixins: [util, togglePasswordVisibility],
  data() {
    return {
      required,
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      mobile: "",
      email: "",
      role: null,
      company: null,
    };
  },
  methods: {
    ...mapActions({
      createUser: "appData/createUser",
      getRoles: "appData/getRoles",
      getCompanys: "appData/getCompanys",
    }),
    async validationForm() {
      const success = await this.$refs.createUserFormValidation.validate();
      if (success) {
        await this.submit();
      }
    },
    async submit() {
      try {
        const res = await this.createUser({
          username: this.username,
          password: this.password,
          first_name: this.firstName,
          last_name: this.lastName,
          mobile: this.mobile,
          email: this.email,
          role: this.role.id,
          company: this.company.id,
          created_by: this.getLoggedInUser.id,
          updated_by: this.getLoggedInUser.id,
        });
        if (res.status === 201) {
          this.$swal({
            title: "User created successfully",
            icon: "success",
          });
          this.$nextTick(() => {
            this.$bvModal.hide("create-user-modal");
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
    passwordToggleIcon() {
      return this.passwordFieldType === "password" ? "EyeIcon" : "EyeOffIcon";
    },
  },
};
</script>

<style></style>
