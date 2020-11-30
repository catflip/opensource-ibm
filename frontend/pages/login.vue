<template>
  <Login />
</template>
<script lang="ts">
import Login from '@/components/Login.vue'
import { Component, Vue } from 'nuxt-property-decorator'
@Component({
  components: {
    Login,
  },
})
export default class MyStore extends Vue {}
</script>
