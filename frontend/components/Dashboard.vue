<template>
  <v-container>
    <v-row justify="space-between">
      <v-col cols="4" class="text-h4 font-weight-bold">Dashboard</v-col>
      <v-col cols="4" class="d-flex justify-end"
        ><v-btn @click="logout">LOGOUT</v-btn></v-col
      >
    </v-row>
    <DashboardInfo :username="username" :profilePhoto="profilePhoto" :paypalToken="paypalToken" @connect="connectPaypal"/>
    <v-row justify="space-between">
      <v-col cols="4" class="text-h4 font-weight-bold">Private Repo List</v-col>
    </v-row>
    <DashboardRepo
      :refreshRepo="getPrivateRepo"
      :listRepo="privateRepo"
      @sell-repo="sellRepo($event._id, $event.amount)"
      @unlist-repo="unlistRepo($event._id)"
    />
    <v-row justify="space-between">
      <v-col cols="4" class="text-h4 font-weight-bold">Owned Repo</v-col>
    </v-row>
    <DashboardRepo :listRepo="ownedRepo" />
    <v-snackbar v-model="snackbarAmount">
      the amount shouldn't be negative or zero
    </v-snackbar>
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
  public snackbarAmount: boolean = false
  public paypalToken: boolean = false
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
    const getPaypalUrl = process.env.get_paypal_url
    const { data } = await this.$axios.get(`${url}?token=${token}`)
    const privateRepo = await this.$axios.get(
      `${privateRepoUrl}?token=${token}`
    )
    const ownedRepo = await this.$axios.get(`${ownedRepoUrl}?token=${token}`)
    const paypalToken = await this.$axios.get(`${getPaypalUrl}?token=${token}`)
    if(paypalToken.data.status){
      this.paypalToken=true
    }
    this.username = data.data.login
    this.profilePhoto = data.data.avatarUrl
    this.privateRepo = privateRepo.data.data
    this.ownedRepo = ownedRepo.data.data
  }
  async getPrivateRepo() {
    const token = Cookies.get('token')
    const url = process.env.get_private_repo_refresh_url
    const { data } = await this.$axios.get(`${url}?token=${token}`)
    this.privateRepo = data.data
  }
  async sellRepo(_id: string, amount: number) {
    // console.log(amount)
    if (Number(amount) === 0 || Number(amount) < 0) {
      console.log(amount)
      this.snackbarAmount = true
      return
    } else {
      const token = Cookies.get('token')
      const url = process.env.sell_repo_url

      const { data } = await this.$axios.post(`${url}?token=${token}`, {
        _id,
        amount,
      })
      this.privateRepo = data.data
    }
  }
  async unlistRepo(_id: string) {
    const token = Cookies.get('token')
    const url = process.env.unlist_repo_url
    const { data } = await this.$axios.post(`${url}?token=${token}`, { _id })
    this.privateRepo = data.data
  }
  async connectPaypal(){
    if(this.username.trim()!==""){
window.location.href=`https://www.sandbox.paypal.com/connect/?flowEntry=static&client_id=${process.env.paypal_client_id}&response_type=code&scope=email&redirect_uri=${process.env.redirect_uri_paypal}`
    }else{alert("please wait until username shown")}

    // const formData=new FormData()
    // formData.append("grant_type","client_credentials")
    // const {data}=this.$axios({method:"POST",url:`https://api-m.sandbox.paypal.com/v1/oauth2/token`,headers:{"Authorization":"Basic "+window.btoa(`${process.env.paypal_client_id}:${process.env.paypal_client_secret}`)},data:formData})
    // console.log(data)
  }
}
</script>
