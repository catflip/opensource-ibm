<template>
  <v-row>
     <v-card max-width="344" outlined>
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="headline mb-1">
              Github Username
            </v-list-item-title>
            <v-list-item-title class="text-h5">spiritbro1</v-list-item-title>
          </v-list-item-content>

          <v-list-item-avatar size="80" color="grey">
            <v-img src="https://source.unsplash.com/random" />
          </v-list-item-avatar>
        </v-list-item>
      </v-card>
      <v-card class="mx-5" max-width="344" outlined>
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="headline mb-1">
              Balance
            </v-list-item-title>
            <v-list-item-title>
              <v-row justify="space-between">
                <v-col class="font-weight-bold text-h5">$ 1000</v-col>
                <v-col><v-btn color="green" >withdraw</v-btn></v-col>
              </v-row>


            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card>
  </v-row>
</template>
