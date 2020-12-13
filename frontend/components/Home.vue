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
      <v-card
        class="mx-auto my-12"
        max-width="374"
        :key="index"
        v-for="(item, index) in forSale"
      >
        <v-img height="250" :src="item.openGraphImageUrl"></v-img>

        <v-card-title>{{ item.name }}</v-card-title>

        <v-card-text>
          <div>{{ item.description }}</div>
        </v-card-text>

        <v-divider class="mx-4"></v-divider>

        <v-card-actions>
          <v-flex>$ {{ item.amount }}</v-flex>
          <v-flex v-if="item.username !== username && !item.owned"
            ><div class="d-flex justify-end">
              <v-btn
              :disabled="disabled"
                class="d-flex justify-end"
                color="deep-purple lighten-2"
                @click="buyNow(item._id)"
                text
              >
                Buy Now
              </v-btn>
            </div></v-flex
          >
          <v-flex v-if="item.username === username || item.owned"
            ><div class="d-flex justify-end">
              <v-btn
              :disabled="disabled"
                class="d-flex justify-end"
                color="deep-purple lighten-2"
                :href="item.url"
                target="_blank"
                text
              >
                GO TO URL
              </v-btn>
            </div></v-flex
          >
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
  public forSale: Array<object> = []
  public username: string = ''
  public disabled: boolean = false
  public buy_paypal_url: string = ""
  logout() {
    Cookies.remove('token')
    window.location.reload()
  }
  async mounted() {

    const token = Cookies.get('token')
    const ownedRepoUrl = process.env.get_owned_repo_url
    const url = process.env.for_sale_repo_url
    try {
      const { data } = await this.$axios.get(`${url}?token=${token}`)
      const ownedRepo = await this.$axios.get(`${ownedRepoUrl}?token=${token}`)

      this.forSale = data.data.data.map((a:any) => {
        if (
          ownedRepo.data.data.filter((b:any) => b.owner_username === a.username)
            .length > 0
        ) {
          a.owned = true
          return a
        } else {
          return a
        }
      })
      this.username = data.data.username
    } catch (e) {
      console.log(e.message)
    }
  }
  async buyNow(_id:any) {
    this.disabled=true;
    const token = Cookies.get('token')
    const url=<string>process.env.buy_paypal_url;
    const res = await this.$axios.post(url, { _id, token })
    if (res.data) {
      const link=res.data.result.links.filter((a:any)=>a.rel==="approve")[0].href
      window.location.href=link;
    }else{
      this.disabled=false;
      alert("error")
    }
  }
}
</script>
