<template>
  <div class="pt-1 px-50">
    <validation-observer ref="employeeReportFormValidation">
      <b-form @submit.prevent>
        <div>
          <!--Employee Submissions Report-->
          <b-card>
            <b-row class="mb-2">
              <b-col md="12">
                <h4 class="mb-0">Employee Submission Report</h4>
                <p class="text-muted mb-0">
                  View contract submissions by employees within date range
                </p>
              </b-col>
            </b-row>
            <b-row class="align-items-center justify-content-between">
              <b-col md="4">
                <b-form-group label-for="startDate">
                  <template #label>
                    Start Date <span class="text-danger">*</span>
                  </template>
                  <validation-provider
                    #default="{ errors }"
                    name="Start Date"
                    rules="required"
                  >
                    <b-form-input
                      id="startDate"
                      v-model="startDate"
                      type="date"
                      :state="errors.length > 0 ? false : null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>

              <b-col md="4">
                <b-form-group label-for="endDate">
                  <template #label>
                    End Date <span class="text-danger">*</span>
                  </template>
                  <validation-provider
                    #default="{ errors }"
                    name="End Date"
                    rules="required"
                  >
                    <b-form-input
                      id="endDate"
                      v-model="endDate"
                      type="date"
                      :state="errors.length > 0 ? false : null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>

              <b-col md="4" class="text-right">
                <b-form-group class="mb-0">
                  <b-button
                    type="submit"
                    variant="primary"
                    size="sm"
                    pill
                    @click="validationForm"
                    class="mr-1"
                  >
                    <feather-icon icon="SearchIcon" class="mr-50" />
                    Generate Report
                  </b-button>
                </b-form-group>
              </b-col>
            </b-row>
          </b-card>
          <b-card>
            <b-table
              :items="transformedData"
              :fields="fields"
              responsive
              bordered
              striped
              hover
              class=""
              small
            >
              <template #cell(created_at)="row">
                {{ formatDateTime(row.item.created_at) }}
              </template>
            </b-table>
          </b-card>
        </div>
      </b-form>
    </validation-observer>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required } from "@validations";
import moment from "moment";
import util from "@/util.js";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  mixins: [util],
  data() {
    return {
      startDate: null,
      endDate: null,
      baseFields: [
        { key: "full_name", label: "Full Name" },
        { key: "username", label: "Username" },
        { key: "email", label: "Email" },
        { key: "mobile", label: "Mobile" },
      ],
      statusFields: [],
      data: [],
      required,
    };
  },

  methods: {
    ...mapActions({
      getEmployeeReport: "appData/getEmployeeReport",
    }),

    formatDateTime(dateString) {
      if (!dateString) return "-";
      return moment(dateString).format("MMM DD, YYYY hh:mm A");
    },
    async validationForm() {
      const success = await this.$refs.employeeReportFormValidation.validate();
      if (success) {
        await this.submit();
      }
    },
    async submit() {
      // Additional validation for date range
      if (new Date(this.startDate) > new Date(this.endDate)) {
        this.$swal({
          title: "Validation Error",
          text: "Start date cannot be after end date",
          icon: "error",
        });
        return;
      }

      try {
        const payload = {
          start_date: this.startDate,
          end_date: this.endDate,
        };
        const response = await this.getEmployeeReport(payload);
        this.data = response.data;

        // Dynamically generate status fields from first employee's performance_data
        if (this.data.length > 0 && this.data[0].performance_data) {
          this.statusFields = this.data[0].performance_data.map((perf) => ({
            key: `status_${perf.status.replace(/\s+/g, "_")}`,
            label: perf.status,
          }));
        }

        if (this.data.length === 0) {
          this.$swal({
            title: "No Data",
            text: "No employee submissions found for the selected date range",
            icon: "info",
          });
        }
      } catch (error) {
        this.displayError(error);
      }
    },
  },
  mounted() {
    // Set default dates: current month (first day to today)
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    this.startDate = firstDayOfMonth.toISOString().split("T")[0];
    this.endDate = today.toISOString().split("T")[0];
  },
  computed: {
    ...mapGetters({
      hasRole: "appData/hasRole",
      hasPermission: "appData/hasPermission",
      getLoggedInUser: "appData/getLoggedInUser",
    }),
    fields() {
      return [
        ...this.baseFields,
        ...this.statusFields,
        {
          key: "total",
          label: "Total",
        },
      ];
    },
    transformedData() {
      return this.data.map((employee) => {
        const transformed = { ...employee };
        let total = 0;

        // Add each status count as a separate property
        if (employee.performance_data) {
          employee.performance_data.forEach((perf) => {
            const key = `status_${perf.status.replace(/\s+/g, "_")}`;
            transformed[key] = perf.count;
            total += perf.count;
          });
        }

        // Add total column
        transformed.total = total;

        return transformed;
      });
    },
  },
};
</script>

<style scoped></style>
