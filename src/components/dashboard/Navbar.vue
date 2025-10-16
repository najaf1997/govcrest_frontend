<template>
  <div class="bg-primary" style="height: 5%">
    <div
      class="d-flex justify-content-center align-items-center h-100 p-1 myClass"
    >
      <b-link
        class="text-white my-nav-item my-nav-link d-flex align-items-center"
        :to="{ name: 'Hr' }"
      >
        <feather-icon icon="HomeIcon" size="22" class="mr-1 text-white" />
        <span style="font-size: 16px; font-weight: 600">Home</span>
      </b-link>

      <b-link
        class="text-white my-nav-item my-nav-link d-flex align-items-center ml-3"
        :to="{ name: 'Role' }"
      >
        <feather-icon icon="UsersIcon" size="22" class="mr-1 text-white" />
        <span style="font-size: 16px; font-weight: 600; font-family: Arial"
          >Role</span
        >
      </b-link>

      <b-link
        class="text-white my-nav-item my-nav-link d-flex align-items-center ml-3"
        :to="{ name: 'User' }"
      >
        <feather-icon icon="UserIcon" size="22" class="mr-1 text-white" />
        <span style="font-size: 16px; font-weight: 600; font-family: Arial"
          >User</span
        >
      </b-link>

      <b-link
        class="text-white my-nav-item my-nav-link d-flex align-items-center ml-3"
        :to="{ name: 'Organization' }"
      >
        <feather-icon icon="ToolIcon" size="22" class="mr-1 text-white" />
        <span style="font-size: 16px; font-weight: 600; font-family: Arial"
          >LookUps</span
        >
      </b-link>
      <b-link
        class="text-white my-nav-item my-nav-link d-flex align-items-center ml-3"
        :to="{ name: 'Project' }"
      >
        <feather-icon icon="ApertureIcon" size="22" class="mr-1 text-white" />
        <span style="font-size: 16px; font-weight: 600; font-family: Arial"
          >Project</span
        >
      </b-link>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      hasPermission: "appData/hasPermission",
      getLoggedInUser: "appData/getLoggedInUser",
    }),
  },
};
</script>

<style>
.myClass .my-nav-link {
  position: relative;
  text-decoration: none;
}

.myClass .my-nav-link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -6px; /* adjust position */
  width: 0;
  height: 2px;
  background: white;
  transition: width 0.3s ease;
}

.myClass .my-nav-link:hover::after {
  width: 100%;
}
</style>
