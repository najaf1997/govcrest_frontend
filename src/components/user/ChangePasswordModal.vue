<template>
  <b-modal
    :id="modalId"
    centered
    size="md"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true"
    dialog-class="my-dialog-class"
  >
    <template #modal-title>
      <h2 class="m-0 text-primary">Change Password</h2>
    </template>
    <div v-if="user" class="mb-2">
      <b-alert variant="info" show class="mb-0">
        <strong>User:</strong> {{ user.full_name }} ({{ user.username }})
      </b-alert>
    </div>
    <validation-observer ref="changePasswordFormValidation">
      <b-form @submit.prevent>
        <b-form-group label-for="newPassword">
          <template #label>
            New Password <span class="text-danger">*</span>
          </template>
          <validation-provider
            #default="{ errors }"
            name="New Password"
            vid="newPassword"
            rules="required|min:8"
          >
            <b-input-group
              class="input-group-merge"
              :class="errors.length > 0 ? 'is-invalid' : null"
            >
              <b-form-input
                id="newPassword"
                v-model="newPassword"
                :state="errors.length > 0 ? false : null"
                class="form-control-merge"
                :type="passwordFieldType"
                name="newPassword"
                placeholder="Enter new password"
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
            <div class="mt-1">
              <small class="text-muted d-block"
                ><strong>Password Requirements:</strong></small
              >
              <small class="text-muted d-block"
                >• Must be at least 8 characters long</small
              >
              <small class="text-muted d-block"
                >• Cannot be too similar to username, email, or name</small
              >
              <small class="text-muted d-block"
                >• Cannot be a common password (e.g., "password123")</small
              >
              <small class="text-muted d-block"
                >• Cannot be entirely numeric</small
              >
            </div>
          </validation-provider>
        </b-form-group>

        <b-form-group label-for="confirmPassword">
          <template #label>
            Confirm Password <span class="text-danger">*</span>
          </template>
          <validation-provider
            #default="{ errors }"
            name="Confirm Password"
            rules="required|confirmed:newPassword"
          >
            <b-input-group
              class="input-group-merge"
              :class="errors.length > 0 ? 'is-invalid' : null"
            >
              <b-form-input
                id="confirmPassword"
                v-model="confirmPassword"
                :state="errors.length > 0 ? false : null"
                class="form-control-merge"
                :type="confirmPasswordFieldType"
                name="confirmPassword"
                placeholder="Confirm new password"
              />
              <b-input-group-append is-text>
                <feather-icon
                  class="cursor-pointer"
                  :icon="confirmPasswordToggleIcon"
                  @click="toggleConfirmPasswordVisibility"
                />
              </b-input-group-append>
            </b-input-group>
            <small class="text-danger">{{ errors[0] }}</small>
          </validation-provider>
        </b-form-group>
      </b-form>
    </validation-observer>
    <template #modal-footer>
      <b-form-group class="text-right">
        <b-button
          type="button"
          variant="secondary"
          pill
          @click="closeModal"
          class="mr-1"
          :disabled="isFormDisabled"
        >
          Cancel
        </b-button>
        <b-button
          type="submit"
          variant="primary"
          pill
          @click="validationForm"
          :disabled="isFormDisabled"
        >
          Change Password
        </b-button>
      </b-form-group>
    </template>
  </b-modal>
</template>

<script>
import { mapActions } from "vuex";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required } from "@validations";
import util from "@/util.js";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  props: {
    user: Object,
    modalId: {
      type: String,
      default: "change-password-modal",
    },
  },
  mixins: [util],
  data() {
    return {
      newPassword: "",
      confirmPassword: "",
      passwordFieldType: "password",
      confirmPasswordFieldType: "password",
      isFormDisabled: false,
      required,
    };
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === "password" ? "EyeIcon" : "EyeOffIcon";
    },
    confirmPasswordToggleIcon() {
      return this.confirmPasswordFieldType === "password"
        ? "EyeIcon"
        : "EyeOffIcon";
    },
  },
  methods: {
    ...mapActions({
      changePassword: "appData/changePassword",
    }),
    togglePasswordVisibility() {
      this.passwordFieldType =
        this.passwordFieldType === "password" ? "text" : "password";
    },
    toggleConfirmPasswordVisibility() {
      this.confirmPasswordFieldType =
        this.confirmPasswordFieldType === "password" ? "text" : "password";
    },
    async validationForm() {
      const success = await this.$refs.changePasswordFormValidation.validate();
      if (success) {
        await this.submit();
      }
    },
    async submit() {
      if (!this.user) {
        this.$swal({
          title: "Error",
          text: "No user selected",
          icon: "error",
        });
        return;
      }
      try {
        this.isFormDisabled = true;
        const payload = {
          user_id: this.user.id,
          new_password: this.newPassword,
          confirm_password: this.confirmPassword,
        };

        const res = await this.changePassword(payload);
        if (res.status === 200 || res.status === 201) {
          this.$swal({
            title: "Password changed successfully",
            icon: "success",
          });
          this.$nextTick(() => {
            this.$bvModal.hide(this.modalId);
          });
          this.resetForm();
          this.$emit("modalClosed");
        }
      } catch (error) {
        this.displayError(error);
      } finally {
        this.isFormDisabled = false;
      }
    },
    resetForm() {
      this.newPassword = "";
      this.confirmPassword = "";
      this.passwordFieldType = "password";
      this.confirmPasswordFieldType = "password";
      if (this.$refs.changePasswordFormValidation) {
        this.$refs.changePasswordFormValidation.reset();
      }
    },
    closeModal() {
      this.resetForm();
      this.$bvModal.hide(this.modalId);
    },
  },
};
</script>

<style scoped></style>
