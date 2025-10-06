<template>
  <div style="height: 100vh; background-color: #64748b">
    <div
      class="h-100 align-items-center justify-content-center d-none d-md-flex"
    >
      <b-card
        style="border-radius: 20px; border: 1px solid lightgrey"
        class="px-1 m-0 d-none d-md-block"
      >
        <div class="mt-1 text-center">
          <img :src="this.appLogoImage" img-fluid width="200" />
        </div>

        <b-card-title
          title-tag="h2"
          class="font-weight-bolder text-colorBlack mb-50 mt-2 pr-5 mr-5"
        >
          Welcome to {{ this.appName }}.
        </b-card-title>
        <b-card-text class="text-colorGray" style="font-size: 0.8rem">
          Please Enter your Credentials to access the Portal
        </b-card-text>

        <validation-observer ref="loginFormValidation">
          <b-form class="auth-login-form mt-2" @submit.prevent>
            <b-form-group label-for="username">
              <validation-provider
                #default="{ errors }"
                name="Username"
                rules="required"
              >
                <b-form-input
                  id="username"
                  v-model="username"
                  :state="errors.length > 0 ? false : null"
                  name="username"
                  placeholder="Username"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <b-form-group label-for="password" class="mt-2">
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
                    placeholder="Password"
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

            <b-button
              type="submit"
              variant="primary"
              block
              @click="validateForm"
            >
              Sign in
            </b-button>
          </b-form>
        </validation-observer>
      </b-card>
    </div>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required } from "@validations";
import { togglePasswordVisibility } from "@core/mixins/ui/forms";
import { $themeConfig } from "@themeConfig";
import { mapActions, mapGetters } from "vuex";
import util from "@/util.js";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  mixins: [togglePasswordVisibility, util],
  data() {
    return {
      appName: "",
      appFullName: "",
      appFullName: "",
      password: "",
      username: "",
      required,
    };
  },
  created() {
    this.appName = $themeConfig.app.appName;
    this.appFullName = $themeConfig.app.appFullName;
    this.appLogoImage = $themeConfig.app.appLogoImage;
  },
  methods: {
    ...mapActions({ login: "appData/login" }),
    async validateForm() {
      const success = await this.$refs.loginFormValidation.validate();
      if (success) {
        await this.submit();
      }
    },
    async submit() {
      try {
        const res = await this.login({
          username: this.username,
          password: this.password,
        });
        if (res.status === 200) {
          this.$swal({
            title: "Logged in successfully",
            icon: "success",
          });
          this.$router.push({ name: "User" });
        }
      } catch (error) {
        this.displayError(error);
      }
    },
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === "password" ? "EyeIcon" : "EyeOffIcon";
    },
    ...mapGetters({ hasRole: "appData/hasRole" }),
  },
};
</script>

<style scoped></style>
