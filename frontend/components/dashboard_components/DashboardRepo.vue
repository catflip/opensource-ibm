<template>
  <div>
    <v-row class="mb-2"><v-btn>Refresh Repo List</v-btn></v-row>
<v-row>
      <v-card max-width="400">
      <v-card-title>
        <v-list-item class="grow">
          <v-list-item-content>
            <v-list-item-title>Evan You</v-list-item-title>
          </v-list-item-content>

          <v-row align="center" justify="end"> Private </v-row>
        </v-list-item>
      </v-card-title>

      <v-card-text class="text-md font-weight-bold">
        <v-list-item>
          <v-list-item-content
            >"Turns out semicolon-less style is easier and safer in TS because
            most gotcha edge cases are type invalid as
            well."</v-list-item-content
          >
          <v-list-item-avatar tile size="100" color="grey">
            <v-img src="https://source.unsplash.com/random" />
          </v-list-item-avatar>
        </v-list-item>
      </v-card-text>
      <v-card-action
        ><v-row class="d-flex align-content-center mx-5">
          <v-col cols="5" class="d-flex justify-start " >
            <v-text-field  label="Amount" type="number" outlined prefix="$"></v-text-field>
          </v-col>
          <v-col class="d-flex justify-end mt-2">
            <v-btn color="red">SELL</v-btn><v-btn>UNLIST</v-btn>
          </v-col>
        </v-row></v-card-action
      >
    </v-card>
</v-row>

  </div>
</template>
