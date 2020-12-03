<template>
  <v-container>
    <v-row justify="space-between">
      <v-col cols="4" class="text-h4 font-weight-bold">Dashboard</v-col>
      <v-col cols="4" class="d-flex justify-end"><v-btn>LOGOUT</v-btn></v-col>
    </v-row>
    <DashboardInfo />
    <v-row justify="space-between">
      <v-col cols="4" class="text-h4 font-weight-bold">Private Repo List</v-col>
    </v-row>
    <DashboardRepo />
  </v-container>
</template>

<script lang="ts">
import Cookies from 'js-cookie'
import DashboardInfo from '@/components/dashboard_components/DashboardInfo.vue'
import DashboardRepo from '@/components/dashboard_components/DashboardRepo.vue'
import { Component, Vue, Prop } from 'nuxt-property-decorator'
@Component({
  components: {
    DashboardInfo,
    DashboardRepo,
  },
})
export default class MyStore extends Vue {
  @Prop({ required: true }) readonly login!: boolean
  mounted() {
    // if (!this.login) window.location.href = '/'
  }
}
</script>
