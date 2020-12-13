<template>
  <Dashboard :login="login" />
</template>
<script lang="ts">
import Cookies from 'js-cookie'
import Dashboard from '@/components/Dashboard.vue'
import { Component, Vue } from 'nuxt-property-decorator'
@Component({
  components: {
    Dashboard,
  },
})
export default class MyStore extends Vue {
  public login: boolean =false;

      mounted(){
this.login=Cookies.get('token') && Cookies?.get('token')?.trim() !== ''
      ? true
      : false
      }
}
</script>
