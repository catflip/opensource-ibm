<template>
  <v-row>
    <v-card max-width="344" outlined>
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="headline mb-1">
            Github Username
          </v-list-item-title>
          <v-list-item-title class="text-h5">{{username}}</v-list-item-title>
        </v-list-item-content>

        <v-list-item-avatar size="80" color="grey">
          <v-img :src="profilePhoto" />
        </v-list-item-avatar>
      </v-list-item>
    </v-card>
    <v-card class="mx-5" max-width="344" outlined>
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="headline mb-1"> Balance </v-list-item-title>
          <v-list-item-title>
            <v-row justify="space-between">

              <v-col class="font-weight-bold text-h5" v-if="paypalToken">$ {{paypalBalance}}</v-col>

              <v-col v-if="paypalToken"><v-btn color="red" :disabled="disabled" @click="disconnect">DISCONNECT PAYPAL</v-btn></v-col>
              <v-col v-if="!paypalToken"><v-btn color="blue" :disabled="disabled" @click="connect">CONNECT PAYPAL</v-btn></v-col>
            </v-row>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </v-row>
</template>
<script lang="ts">
import { Component, Vue, Prop,Emit } from 'nuxt-property-decorator'
@Component
export default class MyStore extends Vue {
  @Prop({ required: true }) readonly username!: string
  @Prop({ required: true }) readonly profilePhoto!: string
    @Prop({ required: false }) readonly paypalBalance!: number
    @Prop({ required: true }) readonly paypalToken!: boolean
    @Prop({ required: true }) readonly disabled!: boolean

@Emit()
connect(){}
@Emit()
disconnect(){}
}
</script>
