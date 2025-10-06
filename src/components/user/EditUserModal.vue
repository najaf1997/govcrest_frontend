<template>
  <b-modal
    id="edit-user-modal"
    centered
    size="lg"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true"
    dialog-class="my-dialog-class"
  >
    <template #modal-title> <h2 class="m-0">Edit User</h2> </template>
    <validation-observer ref="editUserFormValidation">
      <b-form @submit.prevent>
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
            <b-form-group label-for="cnic">
              <template #label>
                CNIC <span class="text-danger">*</span>
              </template>
              <validation-provider
                #default="{ errors }"
                name="CNIC"
                rules="required|integer|length:13"
              >
                <b-form-input
                  id="cnic"
                  v-model="cnic"
                  :state="errors.length > 0 ? false : null"
                  placeholder="CNIC"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
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
        </b-form-row>
        <b-form-row>
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
          <b-col md="6">
            <VueSelectPaginated
              placeholder="Role"
              name="Role"
              label="name"
              rules="required"
              searchBy="name"
              :prevSelected="role"
              :getListMethod="getRoles"
              @setMethod="
                (value) => {
                  role = value;
                }
              "
            />
          </b-col>
        </b-form-row>
      </b-form>
    </validation-observer>
    <template #modal-footer>
      <b-form-group class="text-right">
        <b-button type="submit" variant="info" pill @click="validationForm">
          Update
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
  props: {
    user: Object,
  },
  mixins: [util],
  data() {
    return {
      required,
      firstName: "",
      lastName: "",
      cnic: "",
      mobile: "",
      email: "",
      role: null,
    };
  },
  async mounted() {
    if (this.user) {
      this.firstName = this.user.first_name;
      this.lastName = this.user.last_name;
      this.cnic = this.user.cnic;
      this.mobile = this.user.mobile;
      this.email = this.user.email;
      this.role = this.user.role_data;
    }
  },
  methods: {
    ...mapActions({
      updateUser: "appData/updateUser",
      getRoles: "appData/getRoles",
    }),
    async validationForm() {
      const success = await this.$refs.editUserFormValidation.validate();
      if (success) {
        await this.submit();
      }
    },
    async submit() {
      try {
        const res = await this.updateUser({
          payload: {
            first_name: this.firstName,
            last_name: this.lastName,
            cnic: this.cnic,
            mobile: this.mobile,
            email: this.email,
            role: this.role.id,
            updated_by: this.getLoggedInUser.id,
          },
          pk: this.user.id,
        });
        if (res.status === 200) {
          this.$swal({
            title: "User updated successfully",
            icon: "success",
          });
          this.$nextTick(() => {
            this.$bvModal.hide("edit-user-modal");
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

<style></style>
