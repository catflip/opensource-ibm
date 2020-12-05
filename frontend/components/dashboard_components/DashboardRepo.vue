<template>
  <div>
    <v-row class="mb-2" v-if="refreshRepo"><v-btn @click="refreshRepo">Refresh Repo List</v-btn></v-row>
    <v-row>
      <v-card max-width="400" class="mx-2 my-2" :key=index v-for="(item,index) in listRepo">
        <v-card-title>
          <v-list-item class="grow">
            <v-list-item-content>
              <v-list-item-title>{{item.name}}</v-list-item-title>
            </v-list-item-content>

            <v-row align="center" justify="end"> Private </v-row>
          </v-list-item>
        </v-card-title>

        <v-card-text class="text-md font-weight-bold">
          <v-list-item>
            <v-list-item-content
              >{{item.description}}</v-list-item-content
            >
            <v-list-item-avatar tile size="100" color="grey">
              <v-img :src="item.openGraphImageUrl" />
            </v-list-item-avatar>
          </v-list-item>
        </v-card-text>
        <v-card-action
          ><v-row class="d-flex align-content-center mx-5">
            <v-col cols="5" class="d-flex justify-start">
              <div v-if="item.sell==='SELL'">$ {{item.amount}}</div>
              <v-text-field
              v-if="item.sell==='UNLIST'"
                label="Amount"
                type="number"
                outlined
                prefix="$"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex justify-end mt-2">
              <v-btn color="red" v-if="item.sell==='UNLIST'">SELL</v-btn><v-btn v-if="item.sell==='SELL'">UNLIST</v-btn>
            </v-col>
          </v-row></v-card-action
        >
      </v-card>
    </v-row>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
@Component
export default class MyStore extends Vue {
  @Prop({ required: false }) readonly refreshRepo!: void
  @Prop({ required: true }) readonly listRepo!: Array<object>
}
</script>

