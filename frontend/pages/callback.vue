<template>
  <v-row justify="center" align="center" :class="['text-h1']">REDIRECTING...</v-row>
</template>
<script lang="ts">
import Cookies from 'js-cookie'
import { Component, Vue } from 'nuxt-property-decorator'
@Component
export default class MyStore extends Vue {
  mounted(){
Cookies.set('token', this.$route.query.token)
window.location.href="/"
  }
}
</script>

