<template>
  <p class="clearfix mb-0">
    <span class="float-md-left d-block d-md-inline-block mt-25 text-dark">
      COPYRIGHT © {{ new Date().getFullYear() }}
      <span class="text-primary font-weight-bolder">PAK ARMY</span>
      <span class="d-none d-sm-inline-block">, All rights Reserved</span>
    </span>

    <span class="float-md-right d-none d-md-block text-dark"
      >Made by <span class="text-primary font-weight-bolder">AG's Branch </span>
    </span>
  </p>
</template>

<script>
import { BLink } from "bootstrap-vue";

export default {
  components: {
    BLink,
  },
};
</script>
