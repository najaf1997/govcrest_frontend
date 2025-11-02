<template>
  <div class="navbar-container d-flex content align-items-center rounded">
    <ul class="nav navbar-nav d-xl-none">
      <li class="nav-item">
        <b-link class="nav-link" @click="toggleVerticalMenuActive">
          <feather-icon icon="MenuIcon" size="21" />
        </b-link>
      </li>
    </ul>

    <b-navbar-nav class="nav align-items-center ml-auto">
      <b-nav-item-dropdown
        right
        toggle-class="d-flex align-items-center dropdown-user-link"
        class="dropdown-user"
      >
        <template #button-content>
          <div class="d-sm-flex d-none user-nav">
            <p class="user-name font-weight-bolder mb-0">
              {{ getLoggedInUser ? getLoggedInUser.username : "" }}
            </p>
          </div>
          <b-avatar
            size="40"
            variant="dark"
            badge
            :src="getLoggedInUser ? getLoggedInUser.profile_image : ''"
            class="badge-minimal"
            badge-variant="success"
          />
        </template>

        <b-dropdown-item-button :to="{ name: 'Profile' }" button-class="w-100">
          <feather-icon size="16" icon="UserIcon" class="mr-50" />
          <span>Profile</span>
        </b-dropdown-item-button>

        <b-dropdown-item-button
          button-class="w-100"
          @click="openChangePasswordModal"
        >
          <feather-icon size="16" icon="LockIcon" class="mr-50" />
          <span>Change Password</span>
        </b-dropdown-item-button>

        <b-dropdown-divider />

        <b-dropdown-item-button button-class="w-100" @click="logoutButtonClick">
          <feather-icon size="16" icon="LogOutIcon" class="mr-50" />
          <span>Logout</span>
        </b-dropdown-item-button>
      </b-nav-item-dropdown>
    </b-navbar-nav>

    <ChangePasswordModal
      modal-id="navbar-change-password-modal"
      :user="getLoggedInUser"
      @modalClosed="onPasswordChangeModalClosed"
      :key="`change-password-${changePasswordModalCount}`"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ChangePasswordModal from "@/components/user/ChangePasswordModal.vue";

export default {
  components: {
    ChangePasswordModal,
  },
  props: {
    toggleVerticalMenuActive: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      changePasswordModalCount: 0,
    };
  },
  methods: {
    ...mapActions({ logout: "appData/logout" }),
    async logoutButtonClick() {
      try {
        const res = await this.logout();
        if (res.status === 204) {
          this.$router.push({ name: "Login" });
        }
      } catch (error) {
        console.log(error);
      }
    },
    openChangePasswordModal() {
      this.changePasswordModalCount += 1;
      this.$nextTick(() => {
        // Use a unique modal ID to avoid conflicts
        const modalId = "navbar-change-password-modal";
        this.$bvModal.show(modalId);
      });
    },
    onPasswordChangeModalClosed() {
      // Modal closed, no action needed
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
