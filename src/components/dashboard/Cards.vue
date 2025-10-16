<template>
  <div class="px-1">
    <b-row class="h-100 pt-50">
      <!-- Total Employees Card -->
      <b-col md="2" class="dashboard-card">
        <div class="card-content">
          <div class="icon-wrapper bg-primary">
            <feather-icon icon="UsersIcon" size="24" class="text-white" />
          </div>
          <div class="card-info">
            <h3 class="card-value text-primary">
              {{ dashboardCardsData.total_employees || 0 }}
            </h3>
            <h6 class="card-label">Total Employees</h6>
          </div>
        </div>
      </b-col>

      <!-- Submissions This Month Card -->
      <b-col md="2" class="dashboard-card">
        <div class="card-content">
          <div class="icon-wrapper bg-success">
            <feather-icon icon="FileTextIcon" size="24" class="text-white" />
          </div>
          <div class="card-info">
            <h3 class="card-value text-success">
              {{ dashboardCardsData.submissions_this_month || 0 }}
            </h3>
            <h6 class="card-label">Submissions This Month</h6>
          </div>
        </div>
      </b-col>

      <!-- Submissions Previous Month Card -->
      <b-col md="2" class="dashboard-card">
        <div class="card-content">
          <div class="icon-wrapper bg-info">
            <feather-icon icon="FileIcon" size="24" class="text-white" />
          </div>
          <div class="card-info">
            <h3 class="card-value text-info">
              {{ dashboardCardsData.submissions_previous_month || 0 }}
            </h3>
            <h6 class="card-label">Submissions Last Month</h6>
            <small class="text-muted">
              <span
                v-if="submissionsChange !== 0"
                :class="submissionsChangeClass"
              >
                {{ submissionsChange > 0 ? "+" : "" }}{{ submissionsChange }}%
              </span>
            </small>
          </div>
        </div>
      </b-col>

      <!-- Awards This Month Card -->
      <b-col md="2" class="dashboard-card">
        <div class="card-content">
          <div class="icon-wrapper bg-warning">
            <feather-icon icon="AwardIcon" size="24" class="text-white" />
          </div>
          <div class="card-info">
            <h3 class="card-value text-warning">
              {{ dashboardCardsData.awards_this_month || 0 }}
            </h3>
            <h6 class="card-label">Awards This Month</h6>
          </div>
        </div>
      </b-col>

      <!-- Awards Previous Month Card -->
      <b-col md="2" class="dashboard-card">
        <div class="card-content">
          <div class="icon-wrapper bg-danger">
            <feather-icon icon="AwardIcon" size="24" class="text-white" />
          </div>
          <div class="card-info">
            <h3 class="card-value text-danger">
              {{ dashboardCardsData.awards_previous_month || 0 }}
            </h3>
            <h6 class="card-label">Awards Last Month</h6>
            <small class="text-muted">
              <span v-if="awardsChange !== 0" :class="awardsChangeClass">
                {{ awardsChange > 0 ? "+" : "" }}{{ awardsChange }}%
              </span>
            </small>
          </div>
        </div>
      </b-col>

      <!-- Win Rate Card -->
      <b-col md="2" class="dashboard-card">
        <div class="card-content">
          <div class="icon-wrapper bg-gradient-success">
            <feather-icon icon="TrendingUpIcon" size="24" class="text-white" />
          </div>
          <div class="card-info">
            <h3 class="card-value" style="color: #28c76f">{{ winRate }}%</h3>
            <h6 class="card-label">Win Rate This Month</h6>
            <small class="text-muted">
              {{ dashboardCardsData.awards_this_month || 0 }} /
              {{ dashboardCardsData.submissions_this_month || 0 }}
            </small>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import util from "@/util.js";

export default {
  name: "DashboardCards",
  mixins: [util],
  data() {
    return {
      dashboardCardsData: {},
    };
  },
  async mounted() {
    await this.fetchDashboardCardsData();
  },
  methods: {
    ...mapActions({
      getDashboardCardsData: "appData/getDashboardCardsData",
    }),
    async fetchDashboardCardsData() {
      try {
        const res = await this.getDashboardCardsData();
        this.dashboardCardsData = res.data;
      } catch (error) {
        this.displayError(error);
      }
    },
  },
  computed: {
    ...mapGetters({
      hasRole: "appData/hasRole",
      hasPermission: "appData/hasPermission",
      getLoggedInUser: "appData/getLoggedInUser",
    }),
    submissionsChange() {
      const thisMonth = this.dashboardCardsData.submissions_this_month || 0;
      const lastMonth = this.dashboardCardsData.submissions_previous_month || 0;
      if (lastMonth === 0) return 0;
      return Math.round(((thisMonth - lastMonth) / lastMonth) * 100);
    },
    submissionsChangeClass() {
      return this.submissionsChange >= 0 ? "text-success" : "text-danger";
    },
    awardsChange() {
      const thisMonth = this.dashboardCardsData.awards_this_month || 0;
      const lastMonth = this.dashboardCardsData.awards_previous_month || 0;
      if (lastMonth === 0) return 0;
      return Math.round(((thisMonth - lastMonth) / lastMonth) * 100);
    },
    awardsChangeClass() {
      return this.awardsChange >= 0 ? "text-success" : "text-danger";
    },
    winRate() {
      const submissions = this.dashboardCardsData.submissions_this_month || 0;
      const awards = this.dashboardCardsData.awards_this_month || 0;
      if (submissions === 0) return 0;
      return Math.round((awards / submissions) * 100);
    },
  },
};
</script>

<style scoped>
.dashboard-card {
  padding: 0 0.5rem;
  margin-bottom: 0.5rem;
}

.card-content {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.card-content:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  border-color: #0c223a;
}

.icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.bg-gradient-success {
  background: linear-gradient(135deg, #28c76f 0%, #48da89 100%);
}

.card-info {
  text-align: center;
  width: 100%;
}

.card-value {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  line-height: 1;
}

.card-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6e6b7b;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Responsive adjustments */
@media (max-width: 1400px) {
  .card-value {
    font-size: 1.75rem;
  }

  .card-label {
    font-size: 0.8rem;
  }

  .icon-wrapper {
    width: 48px;
    height: 48px;
  }
}

@media (max-width: 1200px) {
  .card-value {
    font-size: 1.5rem;
  }

  .card-label {
    font-size: 0.75rem;
  }

  .card-content {
    padding: 1rem;
  }
}

/* Animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dashboard-card {
  animation: fadeInUp 0.5s ease-out;
}

.dashboard-card:nth-child(1) {
  animation-delay: 0.1s;
}
.dashboard-card:nth-child(2) {
  animation-delay: 0.2s;
}
.dashboard-card:nth-child(3) {
  animation-delay: 0.3s;
}
.dashboard-card:nth-child(4) {
  animation-delay: 0.4s;
}
.dashboard-card:nth-child(5) {
  animation-delay: 0.5s;
}
.dashboard-card:nth-child(6) {
  animation-delay: 0.6s;
}
</style>
