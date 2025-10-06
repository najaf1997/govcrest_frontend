import Vue from "vue";
import { BootstrapVue } from "bootstrap-vue";
import vSelect from "vue-select";
import VueCompositionAPI from "@vue/composition-api";
import VueObserveVisibility from "vue-observe-visibility";

import router from "./router";
import store from "./store";
import App from "./App.vue";

// Global Components
import "./global-components";

// 3rd party plugins
import "@/libs/portal-vue";
import "@/libs/toastification";
import "@/libs/sweet-alerts";

// BSV Registration
Vue.use(BootstrapVue);

// Composition API
Vue.use(VueCompositionAPI);

//VueSelect
Vue.component("v-select", vSelect);

Vue.use(VueObserveVisibility);

Vue.use(require("vue-moment"));

// Feather font icon - For form-wizard
// * Shall remove it if not using font-icons of feather-icons - For form-wizard
require("@core/assets/fonts/feather/iconfont.css"); // For form-wizard

require("vue-select/dist/vue-select.css");

// import core styles
require("@core/scss/core.scss");

// import assets styles
require("@/assets/scss/style.scss");

require("@core/scss/vue/pages/page-auth.scss");
require("@core/scss/vue/libs/vue-wizard.scss");
require("@core/scss/vue/libs/vue-select.scss");

Vue.config.productionTip = false;

function checkAuth() {
  return new Promise(async (resolve) => {
    try {
      await store.dispatch("appData/getCurrentUser");
      resolve();
    } catch (error) {
      resolve();
    }
  });
}

function createApp() {
  new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount("#app");
}

function createBeforeEach() {
  router.beforeEach((to, from, next) => {
    const isLoggedIn = store.getters["appData/isLoggedIn"];
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

    // If route requires authentication
    if (requiresAuth) {
      if (isLoggedIn) {
        // Check if user has required permission
        if (to.meta.permission) {
          if (store.getters["appData/hasPermission"](to.meta.permission)) {
            next();
          } else {
            // User doesn't have permission, redirect to User page
            next({ name: "User" });
          }
        } else {
          // No specific permission required, allow access
          next();
        }
      } else {
        // Not logged in, redirect to login
        next({ name: "Login" });
      }
    } else {
      // Route doesn't require authentication
      if (isLoggedIn && to.name === "Login") {
        // User is logged in but trying to access login page, redirect to User
        next({ name: "User" });
      } else {
        // Allow access to public routes
        next();
      }
    }
  });
}

checkAuth().then(() => {
  createBeforeEach();
  createApp();
});
