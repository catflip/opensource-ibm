<template>
  <v-row justify="center" align="center" :class="['text-h1']">REDIRECTING...</v-row>
</template>
<script lang="ts">
import Cookies from 'js-cookie'
import { Component, Vue } from 'nuxt-property-decorator'
import axios from "axios"
@Component
export default class MyStore extends Vue {
  async mounted(){
    if(this.$route.query.token){
Cookies.set('token', this.$route.query.token)
window.location.href="/"
}else{
  const token=Cookies.get("token")
const {data}=await axios.post(`${process.env.save_paypal_url}`,{token,email:this.$route.query.email})
if(data.status){
window.location.href="/dashboard"
}else{
  window.location.href="/error"
}

}
  }
}
</script>

