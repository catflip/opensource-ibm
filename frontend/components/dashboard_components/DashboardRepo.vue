<template>
  <div>
    <v-row class="mb-2" v-if="refreshRepo"
      ><v-btn @click="refreshRepo" :disabled="disabled">Refresh Repo List</v-btn></v-row
    >
    <v-row>
      <v-card
        width="400"
        class="mx-2 my-2"
        :key="index"
        v-for="(item, index) in listRepo"
      >
        <v-card-title>
          <v-list-item class="grow">
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item-content>

            <v-row align="center" justify="end"> Private </v-row>
          </v-list-item>
        </v-card-title>

        <v-card-text class="text-md font-weight-bold">
          <v-list-item>
            <v-list-item-content>{{ item.description }}</v-list-item-content>
            <v-list-item-avatar tile size="100" color="grey">
              <v-img :src="item.openGraphImageUrl" />
            </v-list-item-avatar>
          </v-list-item>
        </v-card-text>
        <v-card-action
          ><v-row class="d-flex align-content-center mx-5">
            <v-col cols="5" class="d-flex justify-start align-content-center">
              <div
                class="d-flex align-center text-h5"
                :style="{ height: '100%' }"
                v-if="item.sell === 'SELL'&&!ownedRepo"
              >
                $ {{ item.amount }}
              </div>
              <v-text-field
                v-if="item.sell === 'UNLIST'"
                label="Amount"
                type="number"
                outlined
                prefix="$"
                :disabled="!paypalToken"
                v-model="amount"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex mt-2 justify-end">
              <v-btn
                @click="sellRepo(item._id, amount)"
                color="red"
                v-if="item.sell === 'UNLIST'&&!ownedRepo"
                :disabled="!paypalToken||disabled"
                >SELL</v-btn
              ><v-btn :disabled="!paypalToken||disabled" v-if="item.sell === 'SELL'&&!ownedRepo" @click="unlistRepo(item._id)"
                >UNLIST</v-btn
              >
              <v-btn v-if="ownedRepo" target="_blank" :href="item.url"
                >GO TO URL</v-btn
              >
            </v-col>
          </v-row></v-card-action
        >
      </v-card>
    </v-row>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from 'nuxt-property-decorator'
@Component
export default class MyStore extends Vue {
  @Prop({ required: false }) readonly refreshRepo!: void
  @Prop({ required: false }) readonly paypalToken!: boolean
  @Prop({ required: true }) readonly listRepo!: Array<object>
  @Prop({ required: true }) readonly amountRefresh!: number
  @Prop({ required: true }) readonly ownedRepo!: boolean
    @Prop({ required: true }) readonly disabled!: boolean

  public amount: number=this.amountRefresh
  @Emit()
  sellRepo(_id: string, amount: number) {
    return { _id, amount }
  }
  @Emit()
  unlistRepo(_id: string) {
    return { _id }
  }
}
</script>

