<template>
  <div :class="['mx-5', 'my-5']">
    <v-row justify="center">
      <div
        :class="[`text-h1`, 'text-center']"
        v-text="'Open Source Private Marketplace'"
      ></div>
    </v-row>
    <v-row justify="center">
      <div
        :class="[`text-h3`, 'px-5', 'text-center', 'my-5']"
        v-text="'Here you can buy or sell open source private repo'"
      ></div>
    </v-row>
    <v-row justify="center" :class="['my-2']">
      <v-btn
        :class="['my-2']"
        color="info"
        elevation="2"
        v-show="login"
        href="/dashboard"
        >DASHBOARD</v-btn
      >
      <v-btn
        :class="['my-2']"
        color="info"
        elevation="2"
        href="/login"
        v-show="!login"
        >LOGIN</v-btn
      >
      <v-btn
        :class="['my-2', 'mx-2']"
        color="error"
        elevation="2"
        v-show="login"
        @click="logout"
        >LOGOUT</v-btn
      >
    </v-row>
    <v-row>
      <v-card class="mx-auto my-12" max-width="374" :key="index" v-for="(item,index) in forSale">
        <v-img
          height="250"
          :src="item.openGraphImageUrl"
        ></v-img>

        <v-card-title>{{item.name}}</v-card-title>

        <v-card-text>

          <div>{{item.description}}</div>
        </v-card-text>

        <v-divider class="mx-4"></v-divider>

        <v-card-actions>
          <v-flex>$ {{item.amount}}</v-flex>
          <v-flex v-if="item.username!==username" ><div class="d-flex justify-end"><v-btn class="d-flex justify-end" color="deep-purple lighten-2" @click="buyNow(item._id)" text> Buy Now </v-btn>
            </div></v-flex>
<v-flex v-if="item.username===username" ><div class="d-flex justify-end"><v-btn class="d-flex justify-end" color="deep-purple lighten-2" @click="window.location.href=item.url" text> GO TO URL </v-btn>
            </div></v-flex>
        </v-card-actions>
      </v-card>
    </v-row>
  </div>
</template>
<script lang="ts">
import Cookies from 'js-cookie'
import { Component, Vue, Prop } from 'nuxt-property-decorator'
@Component
export default class MyStore extends Vue {
  @Prop({ required: true }) readonly login!: boolean
  public forSale:Array<object>=[]
  public username:string=""
  logout() {
    Cookies.remove('token')
    window.location.reload()
  }
  async created(){
  const token = Cookies.get('token')
    const url = process.env.for_sale_repo_url
    try{
const { data } = await this.$axios.get(`${url}?token=${token}`)
    this.forSale = data.data.data
    this.username=data.data.username
    }catch(e){
console.log(e.message)
    }

  }
  async buyNow(_id){
    const url=process.env.buy_paypal_url
const res=await this.$axios.post(url,{_id})
if(!res.data.status){
  console.log(res.data.message)
}
  }
}
</script>
