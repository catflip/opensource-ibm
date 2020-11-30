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
      <v-btn :class="['my-2']" color="info" elevation="2">LOGIN</v-btn>
      <v-btn :class="['my-2', 'mx-2']" color="error" elevation="2"
        >LOGOUT</v-btn
      >
    </v-row>
    <v-row>
      <v-card class="mx-auto my-12" max-width="374" :key="i" v-for="i in 6">
        <v-img
          height="250"
          src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
        ></v-img>

        <v-card-title>Fast Bitcoin Miner</v-card-title>

        <v-card-text>
          <v-row align="center" class="mx-0">
            <v-rating
              :value="4.5"
              color="amber"
              dense
              half-increments
              readonly
              size="14"
            ></v-rating>

            <div class="grey--text ml-4">4.5 (413)</div>
          </v-row>

          <div>This is a private repo that can mine bitcoin super fast</div>
        </v-card-text>

        <v-divider class="mx-4"></v-divider>

        <v-card-actions>
          <v-btn color="deep-purple lighten-2" text> Detail </v-btn>
          <v-btn color="deep-purple lighten-2" text> Buy Now </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
@Component
export default class MyStore extends Vue {}
</script>
