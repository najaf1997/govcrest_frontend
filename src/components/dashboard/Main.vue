<template>
  <div style="height: 84%; background-color: #b6bcc3" class="px-50">
    <div style="height: 37%">
      <Cards class="h-100" />
    </div>
    <div style="height: 62%" class="pb-0">
      <b-row class="h-100">
        <b-col md="6" class="h-100 p-0 pl-1">
          <HrDistributionTable class="h-100" />
        </b-col>

        <b-col md="6" class="pr-1 pl-0 h-100">
          <HrYearlyComparison class="h-100" />
        </b-col>
      </b-row>
    </div>
    <!-- <div style="height: 43%" class="py-1 pt-50">
      <b-row class="h-100">
        <b-col md="4" class="h-100 pl-2 pr-0 m-0">
          <FieldsData class="h-100" />
        </b-col>
        <b-col md="4" class="pl-50 pr-0 h-100">
          <AttritionTrend class="h-100" />
        </b-col>
        <b-col md="4" class="pl-50 pr-2 h-100">
          <HrYearlyComparison class="h-100" />
        </b-col>
      </b-row>
    </div> -->
  </div>
</template>

<script>
import Cards from "./Cards.vue";
import HrDistributionTable from "./HrDistributionTable.vue";
import HrRankWise from "./HrRankWise.vue";
import OrganizationWiseAmount from "./OrganizationWiseAmount.vue";
import FieldsData from "./FieldsData.vue";
import AttritionTrend from "./AttritionTrend.vue";
import HrYearlyComparison from "./HrYearlyComparison.vue";

export default {
  components: {
    Cards,
    HrDistributionTable,
    HrRankWise,
    OrganizationWiseAmount,
    FieldsData,
    AttritionTrend,
    HrYearlyComparison,
  },
};
</script>
