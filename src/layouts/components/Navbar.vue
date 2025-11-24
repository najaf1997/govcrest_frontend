<template>
  <div class="navbar-container d-flex content align-items-center rounded">
    <ul class="nav navbar-nav d-xl-none">
      <li class="nav-item">
        <b-link class="nav-link" @click="toggleVerticalMenuActive">
          <feather-icon icon="MenuIcon" size="21" />
        </b-link>
      </li>
    </ul>
    
    <!-- Page Title and Breadcrumb in Navbar -->
    <div class="d-flex align-items-center">
      <div class="navbar-breadcrumb d-flex align-items-center" v-if="$route.meta && ($route.meta.pageTitle || $route.meta.breadcrumb)">
        <h2 class="mb-0 font-weight-bold mr-2" v-if="$route.meta.pageTitle">
          {{ $route.meta.pageTitle }}
        </h2>
        <div class="breadcrumb-wrapper d-flex align-items-center" v-if="$route.meta.breadcrumb">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb navbar-breadcrumb-list p-0 m-0">
              <li class="breadcrumb-item">
                <router-link to="/">
                  <feather-icon icon="HomeIcon" size="16" class="align-text-top" />
                </router-link>
              </li>
              <li 
                class="breadcrumb-item"
                v-for="item in $route.meta.breadcrumb" 
                :key="item.text"
                :class="{ 'active': item.active }"
              >
                <router-link v-if="!item.active" :to="item.to || '/'">{{ item.text }}</router-link>
                <span v-else>{{ item.text }}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </div>

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
