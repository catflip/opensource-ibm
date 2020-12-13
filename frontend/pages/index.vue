<template>
  <Home :login="login" />
</template>
<script lang="ts">
import Cookies from 'js-cookie'
import Home from '@/components/Home.vue'
import { Component, Vue } from 'nuxt-property-decorator'
@Component({
  components: {
    Home,
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
