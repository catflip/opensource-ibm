<template>
  <v-container>
    <v-row justify="space-between">
      <v-col cols="4" class="text-h4 font-weight-bold">Dashboard</v-col>
      <v-col cols="4" class="d-flex justify-end"
        ><v-btn @click="logout">LOGOUT</v-btn></v-col
      >
    </v-row>
    <DashboardInfo :username="username" :profilePhoto="profilePhoto" />
    <v-row justify="space-between">
      <v-col cols="4" class="text-h4 font-weight-bold">Private Repo List</v-col>
    </v-row>
    <DashboardRepo :refreshRepo="getPrivateRepo" :listRepo="privateRepo" />
    <v-row justify="space-between">
      <v-col cols="4" class="text-h4 font-weight-bold">Owned Repo</v-col>
    </v-row>
    <DashboardRepo  :listRepo="ownedRepo" />
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
  public username: string = ''
  public profilePhoto: string = ''
  public privateRepo: Array<object> = []
  public ownedRepo: Array<object> = []
  logout() {
    Cookies.remove('token')
    window.location.href = '/'
  }
  async created() {
    // if (!this.login) window.location.href = '/'
    const token = Cookies.get('token')
    const url = process.env.get_profile_url
    const privateRepoUrl = process.env.get_private_repo_url
    const ownedRepoUrl = process.env.get_owned_repo_url
    const {data} = await this.$axios.get(`${url}?token=${token}`)
    const privateRepo = await this.$axios.get(`${privateRepoUrl}?token=${token}`)
    const ownedRepo = await this.$axios.get(`${ownedRepoUrl}?token=${token}`)
    this.username = data.data.login
    this.profilePhoto = data.data.avatarUrl
    this.privateRepo=privateRepo.data.data
    this.ownedRepo=ownedRepo.data.data
  }
  async getPrivateRepo() {
    const token = Cookies.get('token')
    const url = process.env.get_private_repo_refresh_url
    const {data} = await this.$axios.get(`${url}?token=${token}`)
    this.privateRepo=data.data

  }

}
</script>
