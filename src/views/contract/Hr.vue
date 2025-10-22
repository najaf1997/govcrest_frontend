<template>
  <div>
    <b-row class="mb-1" align-v="center">
      <b-col md="12" class="text-right">
        <b-button
          variant="info"
          pill
          @click="openBulkDownloadModal"
          v-if="hasPermission('read_hr')"
          class="mr-50"
        >
          <feather-icon icon="DownloadIcon" class="mr-50" />
          <span class="align-middle">Bulk Download</span>
        </b-button>
        <b-button
          variant="success"
          pill
          @click="createHrFinance"
          v-if="(hasPermission('create_hr') && hasRole('HR')) || hasRole('su')"
        >
          <feather-icon icon="PlusIcon" class="mr-50" />
          <span class="align-middle">Create</span>
        </b-button>
      </b-col>
    </b-row>
    <b-card>
      <b-table
        responsive
        bordered
        :fields="fieldsArray"
        :items="hrs"
        details-td-class="m-0 p-0"
        small
        v-if="hasPermission('read_hr')"
        :per-page="0"
        fixed
      >
        <template #head(full_name)>
          <div class="d-flex flex-column">
            <span class="mb-1 font-weight-bold">Name</span>
            <b-input-group size="sm">
              <b-form-input
                v-model="full_name"
                placeholder="Filter..."
                @input="fetchPaginatedData"
              ></b-form-input>
              <b-input-group-append>
                <b-button
                  size="sm"
                  variant="outline-secondary"
                  @click="
                    full_name = '';
                    fetchPaginatedData();
                  "
                  v-if="full_name"
                >
                  <feather-icon icon="XIcon" size="12" />
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </div>
        </template>
        <template #head(cnic)>
          <div class="d-flex flex-column">
            <span class="mb-1 font-weight-bold">CNIC</span>
            <b-input-group size="sm">
              <b-form-input
                v-model="cnic"
                placeholder="Filter..."
                @input="fetchPaginatedData"
              ></b-form-input>
              <b-input-group-append>
                <b-button
                  size="sm"
                  variant="outline-secondary"
                  @click="
                    cnic = '';
                    fetchPaginatedData();
                  "
                  v-if="cnic"
                >
                  <feather-icon icon="XIcon" size="12" />
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </div>
        </template>
        <template #head(svc_number)>
          <div class="d-flex flex-column">
            <span class="mb-1 font-weight-bold">Svc Number</span>
            <b-input-group size="sm">
              <b-form-input
                v-model="svc_number"
                placeholder="Filter..."
                @input="fetchPaginatedData"
              ></b-form-input>
              <b-input-group-append>
                <b-button
                  size="sm"
                  variant="outline-secondary"
                  @click="
                    svc_number = '';
                    fetchPaginatedData();
                  "
                  v-if="svc_number"
                >
                  <feather-icon icon="XIcon" size="12" />
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </div>
        </template>
        <template #head(phone)>
          <div class="d-flex flex-column">
            <span class="mb-1 font-weight-bold">Phone</span>
            <b-input-group size="sm">
              <b-form-input
                v-model="phone"
                placeholder="Filter..."
                @input="fetchPaginatedData"
              ></b-form-input>
              <b-input-group-append>
                <b-button
                  size="sm"
                  variant="outline-secondary"
                  @click="
                    phone = '';
                    fetchPaginatedData();
                  "
                  v-if="phone"
                >
                  <feather-icon icon="XIcon" size="12" />
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </div>
        </template>
        <template #head(bps)>
          <div class="d-flex flex-column">
            <span class="mb-1 font-weight-bold">BPS</span>
            <b-input-group size="sm">
              <b-form-input
                v-model="bps"
                placeholder="Filter..."
                @input="fetchPaginatedData"
              ></b-form-input>
              <b-input-group-append>
                <b-button
                  size="sm"
                  variant="outline-secondary"
                  @click="
                    bps = '';
                    fetchPaginatedData();
                  "
                  v-if="bps"
                >
                  <feather-icon icon="XIcon" size="12" />
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </div>
        </template>
        <template #head(gender)>
          <div class="d-flex flex-column">
            <span class="mb-1 font-weight-bold">Gender</span>
            <b-form-select
              v-model="gender"
              size="sm"
              @change="fetchPaginatedData"
            >
              <option value="">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </b-form-select>
          </div>
        </template>
        <template #head(organization)>
          <div class="d-flex flex-column">
            <span class="mb-50 font-weight-bold">Organization</span>
            <VueSelectPaginated
              name=""
              label="name"
              searchBy="name"
              :prevSelected="organization"
              :getListMethod="getOrganizations"
              customClass="column-filter-select"
              @setMethod="
                (value) => {
                  organization = value;
                }
              "
            />
          </div>
        </template>
        <template #head(arms)>
          <div class="d-flex flex-column">
            <span class="mb-50 font-weight-bold">Arms</span>
            <VueSelectPaginated
              name=""
              label="name"
              searchBy="name"
              :prevSelected="arms"
              :getListMethod="getArms"
              customClass="column-filter-select"
              @setMethod="
                (value) => {
                  arms = value;
                }
              "
            />
          </div>
        </template>
        <template #head(section)>
          <div class="d-flex flex-column">
            <span class="mb-50 font-weight-bold">Section</span>
            <VueSelectPaginated
              name=""
              label="name"
              searchBy="name"
              :prevSelected="section"
              :getListMethod="getSections"
              customClass="column-filter-select"
              @setMethod="
                (value) => {
                  section = value;
                }
              "
            />
          </div>
        </template>
        <template #head(rank_name)>
          <div class="d-flex flex-column">
            <span class="mb-50 font-weight-bold">Rank</span>
            <VueSelectPaginated
              name=""
              label="name"
              searchBy="name"
              :prevSelected="rank_name"
              :getListMethod="getRanks"
              customClass="column-filter-select"
              @setMethod="
                (value) => {
                  rank_name = value;
                }
              "
            />
          </div>
        </template>
        <template #head(service_type)>
          <div class="d-flex flex-column">
            <span class="mb-50 font-weight-bold">Service Type</span>
            <VueSelectPaginated
              name=""
              label="name"
              searchBy="name"
              :prevSelected="service_type"
              :getListMethod="getServiceTypes"
              customClass="column-filter-select"
              @setMethod="
                (value) => {
                  service_type = value;
                }
              "
            />
          </div>
        </template>
        <template #head(job_title)>
          <div class="d-flex flex-column">
            <span class="mb-50 font-weight-bold">Job Title</span>
            <VueSelectPaginated
              name=""
              label="name"
              searchBy="name"
              :prevSelected="job_title"
              :getListMethod="getJobTitles"
              customClass="column-filter-select"
              @setMethod="
                (value) => {
                  job_title = value;
                }
              "
            />
          </div>
        </template>
        <template #head(medical_category)>
          <div class="d-flex flex-column">
            <span class="mb-50 font-weight-bold">Medical Category</span>
            <VueSelectPaginated
              name=""
              label="name"
              searchBy="name"
              :prevSelected="medical_category"
              :getListMethod="getMedicalCategorys"
              customClass="column-filter-select"
              @setMethod="
                (value) => {
                  medical_category = value;
                }
              "
            />
          </div>
        </template>
        <template #head(course)>
          <div class="d-flex flex-column">
            <span class="mb-50 font-weight-bold">Course</span>
            <VueSelectPaginated
              name=""
              label="name"
              searchBy="name"
              :prevSelected="course"
              :getListMethod="getCourses"
              customClass="column-filter-select"
              @setMethod="
                (value) => {
                  course = value;
                }
              "
            />
          </div>
        </template>
        <template #head(fields)>
          <div class="d-flex flex-column">
            <span class="mb-50 font-weight-bold">Fields</span>
            <VueSelectPaginated
              name=""
              label="name"
              searchBy="name"
              :prevSelected="fields"
              :getListMethod="getFields"
              customClass="column-filter-select"
              @setMethod="
                (value) => {
                  fields = value;
                }
              "
            />
          </div>
        </template>
        <template #head(projects)>
          <div class="d-flex flex-column">
            <span class="mb-50 font-weight-bold">Projects</span>
            <VueSelectPaginated
              name=""
              label="name"
              searchBy="name"
              :prevSelected="projects"
              :getListMethod="getProjects"
              customClass="column-filter-select"
              @setMethod="
                (value) => {
                  projects = value;
                }
              "
            />
          </div>
        </template>
        <template #cell(rank_name)="row">
          {{ row.item.rank_name ? row.item.rank_name.name : "" }}
        </template>
        <template #cell(service_type)="row">
          {{ row.item.service_type ? row.item.service_type.name : "" }}
        </template>
        <template #cell(job_title)="row">
          {{ row.item.job_title ? row.item.job_title.name : "" }}
        </template>
        <template #cell(medical_category)="row">
          {{ row.item.medical_category ? row.item.medical_category.name : "" }}
        </template>
        <template #cell(course)="row">
          {{ row.item.course ? row.item.course.name : "" }}
        </template>
        <template #cell(fields)="row">
          {{ row.item.fields ? row.item.fields.name : "" }}
        </template>
        <template #cell(created_by_data)="row">
          {{
            row.item.created_by_data ? row.item.created_by_data.username : ""
          }}
        </template>
        <template #cell(updated_by_data)="row">
          {{
            row.item.updated_by_data ? row.item.updated_by_data.username : ""
          }}
        </template>
        <template #cell(organization)="row">
          {{ row.item.organization ? row.item.organization.name : "" }}
        </template>
        <template #cell(section)="row">
          {{ row.item.section ? row.item.section.name : "" }}
        </template>
        <template #cell(arms)="row">
          {{ row.item.arms ? row.item.arms.name : "" }}
        </template>
        <template #cell(projects)="row">
          <div>
            <b-badge
              v-for="(project, index) in row.item.projects"
              :key="index"
              class="mr-50"
              variant="primary"
            >
              {{ project.name }}
            </b-badge>
          </div>
        </template>
        <template #cell(projects_data)="row">
          <b-badge
            v-for="(project, index) in row.item.projects_data"
            :key="index"
            variant="primary"
            class="mr-1"
          >
            {{ project.name }}
          </b-badge>
        </template>
        <template #cell(manage)="row">
          <b-button
            variant="primary"
            pill
            size="sm"
            class="mr-50"
            @click="viewHr(row.item)"
            v-if="hasPermission('read_hr')"
          >
            View
          </b-button>
          <b-button
            variant="info"
            pill
            size="sm"
            class="mr-50"
            @click="editHrFinance(row.item)"
            v-if="hasPermission('update_hr')"
          >
            Edit
          </b-button>
          <b-button
            variant="success"
            pill
            size="sm"
            class="mr-50"
            @click="generatePayslip(row.item)"
            v-if="hasPermission('read_hr')"
          >
            Payslip
          </b-button>
          <b-button
            variant="danger"
            pill
            size="sm"
            @click="removeHr(row.item)"
            v-if="hasPermission('delete_hr')"
          >
            Delete
          </b-button>
        </template>
      </b-table>
      <b-pagination
        size="md"
        :total-rows="totalItems"
        v-model="currentPage"
        :per-page="perPage"
      ></b-pagination>
    </b-card>
    <CreateHrModal
      @modalClosed="onModalClosed"
      :key="`create-${createHrFinanceModalCount}`"
    />
    <EditHrModal
      :hr="hr"
      @modalClosed="onModalClosed"
      :key="`edit-${editHrFinanceModalCount}`"
    />
    <ViewHrModal :hr="hr" :key="`view-${viewHrModalCount}`" />
    <BulkDownloadModal ref="bulkDownloadModal" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import VueSelectPaginated from "@/components/ui/VueSelectPaginated.vue";
import util from "@/util.js";
import CreateHrModal from "@/components/hr/CreateHrModal.vue";
import EditHrModal from "@/components/hr/EditHrModal.vue";
import ViewHrModal from "@/components/hr/ViewHrModal.vue";
import BulkDownloadModal from "@/components/hr/BulkDownloadModal.vue";

export default {
  components: {
    CreateHrModal,
    EditHrModal,
    ViewHrModal,
    VueSelectPaginated,
    BulkDownloadModal,
  },
  data() {
    return {
      fieldsArray: [
        { key: "full_name", label: "Name", thStyle: { width: "180px" } },
        { key: "cnic", label: "CNIC", thStyle: { width: "180px" } },
        { key: "svc_number", label: "Svc Number", thStyle: { width: "180px" } },
        { key: "phone", label: "Phone", thStyle: { width: "180px" } },
        {
          key: "organization",
          label: "Organization",
          thStyle: { width: "180px" },
        },
        { key: "arms", label: "Arms", thStyle: { width: "180px" } },
        { key: "section", label: "Section", thStyle: { width: "180px" } },
        { key: "rank_name", label: "Rank", thStyle: { width: "180px" } },
        {
          key: "service_type",
          label: "Service Type",
          thStyle: { width: "180px" },
        },
        { key: "job_title", label: "Job Title", thStyle: { width: "180px" } },
        {
          key: "medical_category",
          label: "Medical Category",
          thStyle: { width: "180px" },
        },
        { key: "course", label: "Course", thStyle: { width: "180px" } },
        { key: "fields", label: "Fields", thStyle: { width: "180px" } },
        { key: "bps", label: "BPS", thStyle: { width: "180px" } },
        { key: "gender", label: "Gender", thStyle: { width: "180px" } },
        { key: "projects", label: "Projects", thStyle: { width: "180px" } },
        { key: "manage", label: "Manage", thStyle: { width: "320px" } },
      ],
      currentPage: 1,
      perPage: 0,
      totalItems: 0,
      hrs: [],
      hr: null,
      createHrFinanceModalCount: 0,
      editHrFinanceModalCount: 0,
      viewHrModalCount: 0,
      full_name: "",
      cnic: "",
      svc_number: "",
      phone: "",
      bps: "",
      gender: "",
      organization: null,
      arms: null,
      section: null,
      rank_name: null,
      service_type: null,
      job_title: null,
      medical_category: null,
      course: null,
      fields: null,
      projects: null,
    };
  },
  mixins: [util],
  async mounted() {
    await this.fetchPaginatedData();
  },
  methods: {
    ...mapActions({
      getHrs: "appData/getHrs",
      getProjects: "appData/getProjects",
      getOrganizations: "appData/getOrganizations",
      getArms: "appData/getArms",
      getSections: "appData/getSections",
      getRanks: "appData/getRanks",
      getServiceTypes: "appData/getServiceTypes",
      getJobTitles: "appData/getJobTitles",
      getMedicalCategorys: "appData/getMedicalCategorys",
      getCourses: "appData/getCourses",
      getFields: "appData/getFields",
      deleteHr: "appData/deleteHr",
      generateBulkPayslips: "appData/generateBulkPayslips",
    }),
    async fetchPaginatedData() {
      try {
        const res = await this.getHrs({
          pageNumber: this.currentPage,
          full_name: this.full_name,
          cnic: this.cnic,
          svc_number: this.svc_number,
          phone: this.phone,
          bps: this.bps,
          gender: this.gender,
          organization: this.organization ? this.organization.id : null,
          arms: this.arms ? this.arms.id : null,
          section: this.section ? this.section.id : null,
          rank_name: this.rank_name ? this.rank_name.id : null,
          service_type: this.service_type ? this.service_type.id : null,
          job_title: this.job_title ? this.job_title.id : null,
          medical_category: this.medical_category
            ? this.medical_category.id
            : null,
          course: this.course ? this.course.id : null,
          fields: this.fields ? this.fields.id : null,
          projects: this.projects ? this.projects.id : null,
        });
        this.hrs = res.data.results;
        this.totalItems = res.data.count;
        this.perPage = res.data.per_page;
      } catch (error) {
        this.displayError(error);
      }
    },
    createHrFinance() {
      this.createHrFinanceModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("create-hr-modal");
      });
    },
    editHrFinance(hr) {
      this.hr = hr;
      this.editHrFinanceModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("edit-hr-modal");
      });
    },
    viewHr(hr) {
      this.hr = hr;
      this.viewHrModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("view-hr-modal");
      });
    },
    async removeHr(hr) {
      this.hr = hr;

      this.$swal({
        title: "Are you sure?",
        icon: "warning",
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: "Confirm",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-danger ml-1",
        },
        buttonsStyling: false,
      }).then(async (result) => {
        if (result.value) {
          try {
            const res = await this.deleteHr({
              pk: this.hr.id,
            });
            if (res.status === 200) {
              this.$swal({
                title: "Hr deleted successfully",
                icon: "success",
              });
              if (
                (this.totalItems - 1) % this.perPage === 0 &&
                this.currentPage !== 1
              ) {
                this.currentPage -= 1;
              } else {
                await this.fetchPaginatedData();
              }
            }
          } catch (error) {
            this.show = false;
            this.displayError(error);
          }
        } else {
          this.show = false;
        }
      });
    },
    async onModalClosed() {
      await this.fetchPaginatedData();
    },
    async openBulkDownloadModal() {
      this.$bvModal.show("bulk-download-modal");
    },
    async generatePayslip(hr) {
      try {
        // Get current month and year
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // 1-12
        const currentYear = currentDate.getFullYear();

        // Call backend API to generate payslip
        const res = await this.generateBulkPayslips({
          month: currentMonth,
          year: currentYear,
          hr_ids: [hr.id],
        });

        // Check if response is valid
        if (!res.data) {
          throw new Error("No data received from server");
        }

        // Check if response is a blob
        if (!(res.data instanceof Blob)) {
          throw new Error("Invalid response format");
        }

        // Check if blob is a PDF or if it's an error message
        if (res.data.type === "application/json") {
          const text = await res.data.text();
          const errorData = JSON.parse(text);
          throw new Error(
            errorData.message || errorData.error || "Failed to generate payslip"
          );
        }

        // Create a blob and trigger download
        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Payslip_${hr.full_name}_${currentMonth}_${currentYear}.pdf`;
        link.click();

        // Clean up
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Payslip generation error:", error);
        this.displayError(error);
      }
    },
    generatePayslipOld(hr) {
      // Get current date
      const currentDate = new Date();
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const currentMonth = monthNames[currentDate.getMonth()];
      const currentYear = currentDate.getFullYear();

      // Extract salary components from HR data
      const basicPay = hr.basic_pay || 0;
      const allowances = hr.allowances || "N/A";
      const increment = hr.increment || "N/A";
      const hra = hr.hra || "N/A";
      const projectAllowance = hr.project_allowance || "N/A";
      const fuelAllowance = hr.fuel_allowance || "N/A";
      const totalPay = hr.total_pay || 0;
      const grossPay = hr.gross_pay || 0;
      const netPay = hr.net_pay || 0;
      const arrears = hr.arrears || "N/A";
      const recovery = hr.recovery || "N/A";
      const payableDays = hr.payable_days || "N/A";
      const paidBy = hr.paid_by || "N/A";

      // Create payslip HTML
      const payslipHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Payslip - ${hr.full_name}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              padding: 10px;
            }
            
            .payslip-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              border-radius: 15px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            
            .payslip-header {
              background: linear-gradient(135deg, #1B74B9 0%, #57DA65 100%);
              color: white;
              padding: 15px;
              text-align: center;
              position: relative;
            }
            
            .payslip-header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
              opacity: 0.3;
            }
            
            .company-logo {
              width: 80px;
              height: 80px;
              background: white;
              border-radius: 50%;
              margin: 0 auto 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 24px;
              font-weight: bold;
              color: #1B74B9;
              position: relative;
              z-index: 1;
            }
            
            .payslip-title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 8px;
              position: relative;
              color:black;
              z-index: 1;
            }
            
            .payslip-period {
              font-size: 14px;
              opacity: 0.9;
              position: relative;
              color:black;
              z-index: 1;
              padding-bottom: 10px;
              border-bottom: 2px solid black;
            }
            
            .employee-info {
              padding: 15px 20px;
              background: #f8f9fa;
            }
            
            .employee-details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
              margin-bottom: 15px;
            }
            
            .detail-group {
              background: white;
              padding: 10px;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            }
            
            .detail-label {
              font-size: 10px;
              color: #666;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 4px;
            }
            
            .detail-value {
              font-size: 14px;
              font-weight: 600;
              color: #333;
            }
            
            .salary-breakdown {
              padding: 15px 20px;
            }
            
            .breakdown-section {
              margin-bottom: 15px;
            }
            
            .section-title {
              font-size: 15px;
              font-weight: bold;
              color: #333;
              margin-bottom: 8px;
              padding-bottom: 6px;
              border-bottom: 2px solid black;
            }
            
            .salary-items {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 6px;
            }
            
            .salary-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 8px 12px;
              background: #f8f9fa;
              border-radius: 6px;
            }
            
            
            .item-label {
              font-size: 12px;
              color: #555;
            }
            
            .item-amount {
              font-size: 12px;
              font-weight: bold;
              color: #333;
            }
            
            .total-section {
              background: linear-gradient(135deg, #1B74B9 0%, #57DA65 100%);
              color: white;
              padding: 15px;
              border-radius: 8px;
              text-align: center;
            }
            
            .total-label {
              font-size: 14px;
              margin-bottom: 6px;
              opacity: 0.9;
              color:black;
            }
            
            .total-amount {
              font-size: 24px;
              font-weight: bold;
              color:black;
            }
            
            .payslip-footer {
              padding: 15px 20px;
              background: #f8f9fa;
              text-align: center;
              color: #666;
              font-size: 10px;
              color:black;
            }
            
            .signature-section {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-top: 15px;
            }
            
            .signature-box {
              text-align: center;
            }
            
            .signature-line {
              border-bottom: 2px solid #333;
              margin-bottom: 6px;
              height: 25px;
            }
            
            .signature-label {
              font-size: 10px;
              color: #666;
              color:black;
            }
            
            @media print {
              @page {
                margin: 0;
                size: A4;
              }
              
              body {
                background: white;
                padding: 0;
                margin: 0;
              }
              
              .payslip-container {
                box-shadow: none;
                border-radius: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="payslip-container">
            <div class="payslip-header">
            
              <h1 class="payslip-title">PAYSLIP</h1>
              <p class="payslip-period">${currentMonth} ${currentYear}</p>
            </div>
            
            <div class="employee-info">
              <div class="employee-details">
                <div class="detail-group">
                  <div class="detail-label">Employee Name</div>
                  <div class="detail-value">${hr.full_name || "N/A"}</div>
                </div>
                 <div class="detail-group">
                  <div class="detail-label">Svc Number</div>
                  <div class="detail-value">${hr.svc_number || "N/A"}</div>
                </div>
          
                <div class="detail-group">
                  <div class="detail-label">Rank</div>
                  <div class="detail-value">${hr.rank_name.name || "N/A"}</div>
                </div>
                <div class="detail-group">
                  <div class="detail-label">Department</div>
                  <div class="detail-value">${
                    hr.organization ? hr.organization.name : "N/A"
                  } - ${hr.section ? hr.section.name : "N/A"}</div>
                </div>
                <div class="detail-group">
                  <div class="detail-label">Cnic</div>
                  <div class="detail-value">${hr.cnic || "N/A"}</div>
                </div>
                 <div class="detail-group">
                  <div class="detail-label">Email</div>
                  <div class="detail-value">${hr.email || "N/A"}</div>
                </div>
                <div class="detail-group">
                  <div class="detail-label">BPS</div>
                  <div class="detail-value">${hr.bps || "N/A"}</div>
                </div>
                <div class="detail-group">
                  <div class="detail-label">Pay Period</div>
                  <div class="detail-value">${currentMonth} 1 - ${currentMonth} ${new Date(
        currentYear,
        currentDate.getMonth() + 1,
        0
      ).getDate()}, ${currentYear}</div>
                </div>
              </div>
            </div>
            
            <div class="salary-breakdown">
              <div class="breakdown-section">
                <h3 class="section-title">Salary Information</h3>
                <div class="salary-items">
                  <div class="salary-item">
                    <span class="item-label">Basic Pay</span>
                    <span class="item-amount">${
                      typeof basicPay === "number"
                        ? "Rs. " + basicPay.toLocaleString()
                        : basicPay
                    }</span>
                  </div>
                  <div class="salary-item">
                    <span class="item-label">Allowances</span>
                    <span class="item-amount">${
                      typeof allowances === "number"
                        ? "Rs. " + allowances.toLocaleString()
                        : allowances
                    }</span>
                  </div>
                  <div class="salary-item">
                    <span class="item-label">Increment</span>
                    <span class="item-amount">${
                      typeof increment === "number"
                        ? "Rs. " + increment.toLocaleString()
                        : increment
                    }</span>
                  </div>
                  <div class="salary-item">
                    <span class="item-label">HRA</span>
                    <span class="item-amount">${
                      typeof hra === "number"
                        ? "Rs. " + hra.toLocaleString()
                        : hra
                    }</span>
                  </div>
                  <div class="salary-item">
                    <span class="item-label">Project Allowance</span>
                    <span class="item-amount">${
                      typeof projectAllowance === "number"
                        ? "Rs. " + projectAllowance.toLocaleString()
                        : projectAllowance
                    }</span>
                  </div>
                  <div class="salary-item">
                    <span class="item-label">Fuel Allowance</span>
                    <span class="item-amount">${
                      typeof fuelAllowance === "number"
                        ? "Rs. " + fuelAllowance.toLocaleString()
                        : fuelAllowance
                    }</span>
                  </div>
                  <div class="salary-item" style="background: #e8f4fd;">
                    <span class="item-label" style="font-weight: bold;">Total Pay</span>
                    <span class="item-amount" style="color: #1B74B9;">${
                      typeof totalPay === "number"
                        ? "Rs. " + totalPay.toLocaleString()
                        : totalPay
                    }</span>
                  </div>
                  <div class="salary-item" style="background: #e8f4fd;">
                    <span class="item-label" style="font-weight: bold;">Gross Pay</span>
                    <span class="item-amount" style="color: #1B74B9;">${
                      typeof grossPay === "number"
                        ? "Rs. " + grossPay.toLocaleString()
                        : grossPay
                    }</span>
                  </div>
                  <div class="salary-item">
                    <span class="item-label">Arrears</span>
                    <span class="item-amount">${
                      typeof arrears === "number"
                        ? "Rs. " + arrears.toLocaleString()
                        : arrears
                    }</span>
                  </div>
                  <div class="salary-item">
                    <span class="item-label">Recovery</span>
                    <span class="item-amount">${
                      typeof recovery === "number"
                        ? "Rs. " + recovery.toLocaleString()
                        : recovery
                    }</span>
                  </div>
                  <div class="salary-item">
                    <span class="item-label">Payable Days</span>
                    <span class="item-amount">${payableDays}</span>
                  </div>
                  <div class="salary-item">
                    <span class="item-label">Paid By</span>
                    <span class="item-amount">${paidBy}</span>
                  </div>
                </div>
              </div>
              
              <div class="total-section">
                <div class="total-label">Net Pay</div>
                <div class="total-amount">${
                  typeof netPay === "number"
                    ? "Rs. " + netPay.toLocaleString()
                    : netPay
                }</div>
              </div>
              
              <div class="signature-section">
                <div class="signature-box">
                  <div class="signature-line"></div>
                  <div class="signature-label">Employee Signature</div>
                </div>
                <div class="signature-box">
                  <div class="signature-line"></div>
                  <div class="signature-label">HR Signature</div>
                </div>
              </div>
            </div>
            
            <div class="payslip-footer">
              <p>This is a computer generated payslip and does not require signature.</p>
              <p>Generated on: ${currentDate.toLocaleDateString()} at ${currentDate.toLocaleTimeString()}</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Open payslip in new window for printing
      const payslipWindow = window.open("", "_blank", "width=1000,height=800");
      payslipWindow.document.write(payslipHTML);
      payslipWindow.document.close();

      // Focus and print
      payslipWindow.onload = function () {
        payslipWindow.focus();
        payslipWindow.print();
        payslipWindow.close();
      };
    },
  },
  computed: {
    ...mapGetters({
      hasPermission: "appData/hasPermission",
      hasRole: "appData/hasRole",
    }),
  },
  watch: {
    currentPage: async function (val) {
      await this.fetchPaginatedData();
    },
    organization: async function (val) {
      if (this.currentPage === 1) {
        await this.fetchPaginatedData();
      } else {
        this.currentPage = 1;
      }
    },
    arms: async function (val) {
      if (this.currentPage === 1) {
        await this.fetchPaginatedData();
      } else {
        this.currentPage = 1;
      }
    },
    section: async function (val) {
      if (this.currentPage === 1) {
        await this.fetchPaginatedData();
      } else {
        this.currentPage = 1;
      }
    },
    rank_name: async function (val) {
      if (this.currentPage === 1) {
        await this.fetchPaginatedData();
      } else {
        this.currentPage = 1;
      }
    },
    service_type: async function (val) {
      if (this.currentPage === 1) {
        await this.fetchPaginatedData();
      } else {
        this.currentPage = 1;
      }
    },
    job_title: async function (val) {
      if (this.currentPage === 1) {
        await this.fetchPaginatedData();
      } else {
        this.currentPage = 1;
      }
    },
    medical_category: async function (val) {
      if (this.currentPage === 1) {
        await this.fetchPaginatedData();
      } else {
        this.currentPage = 1;
      }
    },
    course: async function (val) {
      if (this.currentPage === 1) {
        await this.fetchPaginatedData();
      } else {
        this.currentPage = 1;
      }
    },
    fields: async function (val) {
      if (this.currentPage === 1) {
        await this.fetchPaginatedData();
      } else {
        this.currentPage = 1;
      }
    },
    projects: async function (val) {
      if (this.currentPage === 1) {
        await this.fetchPaginatedData();
      } else {
        this.currentPage = 1;
      }
    },
  },
};
</script>

<style>
/* Hide the label from VueSelectPaginated in column filters */
.column-filter-select .labelStyle {
  display: none !important;
  margin: 0 !important;
}

/* Remove extra margin from form group */
.column-filter-select .form-group {
  margin-bottom: 0 !important;
}

/* Make VueSelectPaginated look exactly like input fields - same colors and styling */
.column-filter-select .vSelectStyle .vs__dropdown-toggle {
  background-color: #fff !important;
  background: #fff !important;
  border: 1px solid #d8d6de !important;
  border-radius: 0.357rem !important;
  min-height: calc(1.5em + 0.75rem + 0px) !important;
  padding: 0.375rem 0.75rem !important;
}

.column-filter-select .vSelectStyle .vs__search {
  background-color: #fff !important;
  background: #fff !important;
  padding: 0 !important;
  margin: 0 !important;
  font-size: 1rem !important;
  line-height: 1.5 !important;
  color: #5e5873 !important;
}

.column-filter-select .vSelectStyle .vs__dropdown-toggle * {
  background-color: #fff !important;
  background: #fff !important;
}

.column-filter-select .vSelectStyle {
  background-color: #fff !important;
  background: #fff !important;
}

.column-filter-select .vSelectStyle .vs__dropdown-toggle:focus-within {
  border-color: #1a6330 !important;
  box-shadow: 0 0 0 0.2rem rgba(15, 74, 17, 0.15) !important;
}

.column-filter-select .vSelectStyle .vs__selected {
  margin: 0 !important;
  padding: 0 !important;
  background-color: transparent !important;
  color: #5e5873 !important;
}

.column-filter-select .vSelectStyle .vs__actions {
  padding: 0 0.5rem !important;
}

.column-filter-select .vSelectStyle .vs__clear {
  fill: #6c757d !important;
}

.column-filter-select .vSelectStyle .vs__open-indicator {
  fill: #6c757d !important;
}

/* Additional aggressive targeting */
.vs__dropdown-toggle {
  background-color: #fff !important;
  background: #fff !important;
}

.vs__search {
  background-color: #fff !important;
  background: #fff !important;
}
</style>
