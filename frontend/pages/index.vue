<template>
  <Home />
</template>
<script lang="ts">
import Home from '@/components/Home.vue'
import { Component, Vue } from 'nuxt-property-decorator'
@Component({
  components: {
    Home,
  },
})
export default class MyStore extends Vue {}
</script>
