<template>
  <div style="height: 100vh">
    <Topbar />
    <Navbar />
    <Main />
    <Footer />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Footer from "@/components/dashboard/Footer.vue";
import Topbar from "@/components/dashboard/Topbar.vue";
import Navbar from "@/components/dashboard/Navbar.vue";
import Main from "@/components/dashboard/Main.vue";

import util from "@/util.js";

export default {
  components: {
    Topbar,
    Navbar,
    Footer,
    Main,
  },
  mixins: [util],
  async mounted() {},
  computed: {
    ...mapGetters({
      hasPermission: "appData/hasPermission",
      getLoggedInUser: "appData/getLoggedInUser",
    }),
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-flatpicker.scss";
</style>
