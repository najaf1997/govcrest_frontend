<template>
  <div class="h-100 p-1 rounded" style="background-color: white">
    <h6
      class="font-weight-bolder text-center m-0 p-0"
      style="font-size: 0.8rem; color: black"
    >
      Fields Distribution
    </h6>
    <div class="fields-container">
      <div v-for="(field, index) in fieldsData" :key="index" class="field-item">
        <div class="d-flex justify-content-between align-items-center mb-50">
          <span class="field-name" style="font-size: 0.8rem; font-weight: bold">
            {{ field.name }}
          </span>
        </div>
        <b-progress
          :value="getProgressValue(field.hr_count)"
          :max="maxCount"
          height="14px"
          class="progress-bar-custom"
        >
          <b-progress-bar
            :value="getProgressValue(field.hr_count)"
            :class="getProgressBarClass(index)"
            class="position-relative"
          >
            <span
              class="progress-text"
              style="font-size: 0.7rem; font-weight: bold; color: white"
            >
              {{ field.hr_count }}
            </span>
          </b-progress-bar>
        </b-progress>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import util from "@/util.js";

export default {
  name: "FieldsData",
  mixins: [util],
  data() {
    return {
      fieldsData: [],
      maxCount: 0,
    };
  },
  async mounted() {
    await this.fetchFieldsData();
  },
  methods: {
    ...mapActions({
      getFieldsData: "appData/getFieldsData",
    }),
    async fetchFieldsData() {
      try {
        const res = await this.getFieldsData();
        const data = res.data;
        if (data && Array.isArray(data) && data.length > 0) {
          this.fieldsData = data;
          // Calculate max count for progress bar scaling
          this.maxCount = Math.max(...data.map((item) => item.hr_count || 0));
        }
      } catch (error) {
        // Error handling removed by user request
      }
    },
    getProgressValue(count) {
      if (this.maxCount === 0) return 0;
      return Math.round((count / this.maxCount) * 100);
    },
    getProgressBarClass(index) {
      // Alternate between green and blue colors
      return index % 2 === 0 ? "progress-bar-green" : "progress-bar-blue";
    },
  },
  computed: {
    ...mapGetters({}),
  },
};
</script>

<style scoped>
.fields-container {
  max-height: calc(100% - 40px);
  overflow-y: auto;
}

.field-item {
  padding: 0.5rem;
  border-radius: 0.25rem;
  background-color: white;
}

.progress-bar-custom {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #e6f2f9;
}

.progress-bar-green {
  background-color: #57da65 !important;
  border: none !important;
}

.progress-bar-blue {
  background-color: #1b74b9 !important;
  border: none !important;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.field-name {
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60%;
}

.field-count {
  color: #666;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 0.1rem 0.3rem;
  border-radius: 0.2rem;
  min-width: 25px;
  text-align: center;
}

/* Custom scrollbar for fields container */
.fields-container::-webkit-scrollbar {
  width: 4px;
}

.fields-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.fields-container::-webkit-scrollbar-thumb {
  background: #59a751;
  border-radius: 2px;
}

.fields-container::-webkit-scrollbar-thumb:hover {
  background: #59a751;
}
</style>
