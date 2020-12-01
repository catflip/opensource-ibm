<template>

   <v-row justify="center" align="center">
<v-card>
  <v-card-text>
    <v-row :class="['my-3','mx-3','text-h4']">LOGIN USING YOUR GITHUB ACCOUNT</v-row>
    <v-row align="center" justify="center">
      <v-btn @click="login_github"><v-icon class="mx-2 my-2">fab fa-github</v-icon>LOGIN</v-btn>
    </v-row>
  </v-card-text>
</v-card>
   </v-row>

</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
@Component
export default class MyStore extends Vue {
  login_github(){
    window.location.href="https://github.com/login/oauth/authorize?client_id="+process.env.github_client_id
  }
}
</script>
