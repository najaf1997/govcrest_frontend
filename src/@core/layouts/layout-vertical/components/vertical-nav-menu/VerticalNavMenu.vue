<template>
  <div
    class="main-menu menu-fixed menu-accordion menu-shadow"
    :class="[
      {
        expanded:
          !isVerticalMenuCollapsed ||
          (isVerticalMenuCollapsed && isMouseHovered),
      },
      skin === 'semi-dark' ? 'menu-dark' : 'menu-light',
    ]"
    @mouseenter="updateMouseHovered(true)"
    @mouseleave="updateMouseHovered(false)"
  >
    <!-- main menu header-->
    <div class="navbar-header expanded">
      <slot
        name="header"
        :toggleVerticalMenuActive="toggleVerticalMenuActive"
        :toggleCollapsed="toggleCollapsed"
        :collapseTogglerIcon="collapseTogglerIcon"
      >
        <ul class="nav navbar-nav flex-row">
          <!-- Logo & Text -->
          <li class="nav-item mr-auto">
            <b-link class="navbar-brand" to="/">
              <span class="brand-logo">
                <b-img :src="appLogoImage" alt="logo" />
              </span>
              <h2 class="brand-text">
                {{ appName }}
              </h2>
            </b-link>
          </li>

          <!-- Toggler Button -->
          <li class="nav-item nav-toggle">
            <b-link class="nav-link modern-nav-toggle">
              <feather-icon
                icon="XIcon"
                size="20"
                class="d-block d-xl-none"
                @click="toggleVerticalMenuActive"
              />
              <feather-icon
                :icon="collapseTogglerIconFeather"
                size="20"
                class="d-none d-xl-block collapse-toggle-icon"
                @click="toggleCollapsed"
              />
            </b-link>
          </li>
        </ul>
      </slot>
    </div>
    <!-- / main menu header-->

    <!-- Shadow -->
    <div :class="{ 'd-block': shallShadowBottom }" class="shadow-bottom" />

    <!-- main menu content-->
    <vue-perfect-scrollbar
      :settings="perfectScrollbarSettings"
      class="main-menu-content scroll-area"
      tagname="ul"
      @ps-scroll-y="
        (evt) => {
          shallShadowBottom = evt.srcElement.scrollTop > 0;
        }
      "
    >
      <vertical-nav-menu-items
        :items="navMenuItems"
        class="navigation navigation-main"
      />
    </vue-perfect-scrollbar>
    <!-- /main menu content-->
  </div>
</template>

<script>
// import navMenuItems from "@/navigation/vertical";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { BLink, BImg } from "bootstrap-vue";
import { provide, computed, ref } from "@vue/composition-api";
import useAppConfig from "@core/app-config/useAppConfig";
import { $themeConfig } from "@themeConfig";
import VerticalNavMenuItems from "./components/vertical-nav-menu-items/VerticalNavMenuItems.vue";
import useVerticalNavMenu from "./useVerticalNavMenu";
import store from "@/store";

export default {
  components: {
    VuePerfectScrollbar,
    VerticalNavMenuItems,
    BLink,
    BImg,
  },
  props: {
    isVerticalMenuActive: {
      type: Boolean,
      required: true,
    },
    toggleVerticalMenuActive: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const navMenuItems = store.getters["appData/getNavMenuItems"];

    const {
      isMouseHovered,
      isVerticalMenuCollapsed,
      collapseTogglerIcon,
      toggleCollapsed,
      updateMouseHovered,
    } = useVerticalNavMenu(props);

    const { skin } = useAppConfig();

    // Shadow bottom is UI specific and can be removed by user => It's not in `useVerticalNavMenu`
    const shallShadowBottom = ref(false);

    provide("isMouseHovered", isMouseHovered);

    const perfectScrollbarSettings = {
      maxScrollbarLength: 60,
      wheelPropagation: false,
    };

    const collapseTogglerIconFeather = computed(() =>
      collapseTogglerIcon.value === "unpinned" ? "CircleIcon" : "DiscIcon"
    );

    // App Name
    const { appName, appLogoImage } = $themeConfig.app;

    return {
      navMenuItems,
      perfectScrollbarSettings,
      isVerticalMenuCollapsed,
      collapseTogglerIcon,
      toggleCollapsed,
      isMouseHovered,
      updateMouseHovered,
      collapseTogglerIconFeather,

      // Shadow Bottom
      shallShadowBottom,

      // Skin
      skin,

      // App Name
      appName,
      appLogoImage,
    };
  },
};
</script>

<style lang="scss">
@import "~@core/scss/base/core/menu/menu-types/vertical-menu.scss";

// Custom dark background for vertical menu (#121212)
.main-menu {
  background-color: #121212 !important;
  background-image: linear-gradient(
    135deg,
    #121212 0%,
    #1a1a1a 100%
  ) !important;
}

// Update navbar header background - slightly lighter for contrast
.main-menu .navbar-header {
  background-color: #1a1a1a !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

// Main menu content area (where the tabs are)
.main-menu .main-menu-content {
  background-color: #121212 !important;
  background-image: linear-gradient(
    135deg,
    #121212 0%,
    #1a1a1a 100%
  ) !important;
}

// Navigation area background
.main-menu .navigation,
.main-menu .navigation-main {
  background-color: transparent !important;
}

// Update text colors for better contrast on dark background
.main-menu .navigation li a {
  color: #e0e0e0 !important;
}

// Active menu item styling - modern purple/blue accent
.main-menu .navigation .nav-item.active > a {
  background: linear-gradient(118deg, #0c223a, #224f80) !important;
  color: #ffffff !important;
  box-shadow: 0 0 10px 1px #0c223a80 !important;
  border-radius: 8px;
}

// Hover effect - subtle purple highlight
.main-menu .navigation li a:hover {
  background-color: #0c223a50 !important;
  color: #ffffff !important;
  border-radius: 8px;
}

// Brand text color
.main-menu .brand-text {
  color: #ffffff !important;
  font-weight: 700;
}

// Menu group headers
.main-menu .navigation-header {
  color: rgba(255, 255, 255, 0.5) !important;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

// Icons color - purple tint
.main-menu .navigation li a svg {
  color: white !important;
}

// Active item icon
.main-menu .navigation .nav-item.active > a svg {
  color: #ffffff !important;
}

// Sub-menu items - darker overlay
.main-menu .navigation .menu-content {
  background-color: rgba(0, 0, 0, 0.25) !important;
  border-radius: 8px;
  margin: 0 10px;
  padding: 5px 0;
}

.main-menu .navigation .menu-content li a {
  color: rgba(224, 224, 224, 0.9) !important;
  padding-left: 50px !important;
}

// Sub-menu hover
.main-menu .navigation .menu-content li a:hover {
  background-color: #0c223a33 !important;
  color: #ffffff !important;
}

// Open/expanded menu items
.main-menu .navigation .nav-item.open > a,
.main-menu .navigation .nav-item.sidebar-group-active > a {
  background-color: rgba(115, 103, 240, 0.1) !important;
  color: #ffffff !important;
  border-radius: 8px;
}

// Shadow bottom (scroll indicator)
.main-menu .shadow-bottom {
  background: linear-gradient(
    #121212 41%,
    rgba(18, 18, 18, 0.11) 95%,
    rgba(18, 18, 18, 0)
  ) !important;
}

// Logo/icon styling
.main-menu .navbar-brand .brand-logo img {
  filter: brightness(1.2);
}
</style>
