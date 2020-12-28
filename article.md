# Create An Open Source Private Marketplace With IBM Cloud
# Introduction

Today im gonna show you how to make an ecommerce website using IBM cloud. I wish after this tutorial you can make the same or much more beautiful ecommerce website using IBM Cloud only, because IBM cloud has so much feature that you need to run a beautiful ecommerce website. The ecommerce i want to create here is a marketplace of private repo of github. Why i want to create a marketplace for it? while github is an open source community. The reason of this is, because i really love open source and if you use github you already know all of this open source maintainer is really struggling with their life some of them is a really great developer and make a great open source contribution but rarely getting sponsored, by creating this ecommerce of collection of private repo i hope they have some kind of way to monetize their open source especially the open source that can't be open to the public because for example an exclusivity of it like in public repo it doesn't have face recognition feature but in private repo it has face recognition feature. So i hope you enjoy this tutorial let's get started.

# Prerequisites

To complete this tutorial you will need :

- A local development environment for Node.js. Follow [How to Install Node.js and Create a Local Development Environment](https://www.digitalocean.com/community/tutorial_series/how-to-install-node-js-and-create-a-local-development-environment).
- A text editor like [Visual Studio Code](https://code.visualstudio.com/download) or [Atom](https://atom.io/).
- A web browser like [Firefox](https://www.mozilla.org/en-US/firefox/new/) or [Chrome](https://www.google.com/chrome/).
- Familiarity with JavaScript. You can look at the [How To Code in JavaScript](https://www.digitalocean.com/community/tutorial_series/how-to-code-in-javascript) series to learn more.
- Familiarity with Nuxtjs. You can take a look at Nuxtjs official documentation [here](https://nuxtjs.org/docs/2.x/get-started/installation).
- Familiarity with Vuejs. You can take a look at Vuejs official documentation [here](https://vuejs.org/v2/guide/).
- Familiarity with Typescript. You can take a look at Typescript official documentation [here](https://www.typescriptlang.org/).
- Familiarity with Nuxtjs Typescript. You can take a look at Nuxtjs Typescript official documentation [here](https://typescript.nuxtjs.org/).
- Sign up for a free IBM Cloud account [here](https://cloud.ibm.com/registration/premium?cm_sp=freelancer-_-webcontest-_-cta)
- Cloud Object Storage (for hosting static web sites, storing data, backups) [here](https://cloud.ibm.com/objectstorage/create?cm_sp=freelancer-_-webcontest-_-cta)
- Functions (for serverless code) [here](https://cloud.ibm.com/functions/?cm_sp=freelancer-_-webcontest-_-cta)
- Cloudant (NoSQL DB) [here]( https://cloud.ibm.com/catalog/services/cloudant?cm_sp=freelancer-_-webcontest-_-cta)
- Github Account [here](https://github.com)
- Paypal Developer Account [here](https://developer.paypal.com/developer/accounts/)
- Clone this [code](https://github.com/spiritbro1/opensource-market) from github to make you much more understand about some of the code i create here.

# Step 1 - Create A Bucket In IBM COS

Create a bucket using setting like this so that we can serve static website from our storage :

![bucket name](https://rino.world/api/convertimage?url=https://imgur.com/download/Rz5GQvW)

Name your bucket, pick Cross Region and ap-geo as location and use smart tier as storage class now we want also to use this as a static website so add rule on the static website rule like this :

![static webhost](https://rino.world/api/convertimage?url=https://imgur.com/download/G7k354V)

Save it and create bucket now we need to create service credential to upload much more easily using rclone if you haven't download rclone use [this](https://cloud.ibm.com/docs/cloud-object-storage?topic=cloud-object-storage-rclone) tutorial to get started, now after you create your bucket click on service credentials menu on the left hand side of your screen then create service credential like this :

![service credential](https://rino.world/api/convertimage?url=https://imgur.com/download/uyVpTEV)

Then you will get access key id and secret like this :

![access key](https://rino.world/api/convertimage?url=https://imgur.com/download/SBZAjCH)

copy paste that for the rclone config so that we can use rclone config to easily upload our frontend file later use this config:

```
type = s3
provider = IBMCOS
env_auth = false
access_key_id = xxxxxx
secret_access_key = xxxxxxxxx
endpoint = s3.ap.cloud-object-storage.appdomain.cloud
location_constraint = ap-standard
acl = private
```

# Step 2 - Create A Frontend And Deploy It To IBM Cloud Object Storage

First of all let's create a simple frontend by using nuxt-typescript run this code in your terminal :

```
yarn create nuxt-app frontend
```

Create your nuxt app using this setting :

```
? Project name: frontend
? Programming language: TypeScript
? Package manager: Yarn
? UI framework: Vuetify.js
? Nuxt.js modules: Axios
? Linting tools: ESLint, Prettier
? Testing framework: Jest
? Rendering mode: Universal (SSR / SSG)
? Deployment target: Static (Static/JAMStack hosting)
? Development tools: (Press <space> to select, <a> to toggle all, <i> to invert selection)
? Continuous integration: None
? Version control system: None
```

Run the app using `yarn dev` if you see this screen, then you're successfully create the nuxt application :

![homepage](https://rino.world/api/convertimage?url=https://imgur.com/download/MldBOzB)

Now we need to create our frontend to suit our needs first let's remove all of the html in pages/index.vue so it will look like this in pages folder :

![delete indexvue](https://rino.world/api/convertimage?url=https://imgur.com/download/9FXTl6d)

Also remove all the component in components folder, and create Home.vue for our homepage like this :

![homepage](https://rino.world/api/convertimage?url=https://imgur.com/download/VbUqgsu)

Now we need to install nuxt-property-decorator, to make our component much more tidier install the package using this command :

```
yarn add nuxt-property-decorator
```

Now go to `components/Home.vue` and let's create our homepage, we are using vuetify here so we gonna use vuetify component as well to create our homepage so lets create our homepage like this :

```
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
```

Now go to your `pages/index.vue` and import this

```
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
```

After that go to `layouts/default.vue` and change the whole content like this :

```
<template>
  <v-app >
<nuxt/>
  </v-app>
</template>
```

Go to the browser and go to `http://localhost:3000` and if its successful you will see something like this :

![homepage](https://rino.world/api/convertimage?url=https://imgur.com/download/kz6upKd)

Now let's upload it to IBM cloud storage using rclone :

```
yarn generate
cd dist
rclone copy ./ <remote name>:<bucket name>
```

Find your static website url under bucket configuration like this :

![configuration menu](https://rino.world/api/convertimage?url=https://imgur.com/download/ZBIUmv2)

![static website url](https://rino.world/api/convertimage?url=https://imgur.com/download/ud0eDp8)

Create public access for your static website like this on access policies menu :

![access policy](https://rino.world/api/convertimage?url=https://imgur.com/download/WX8JaCG)

Then open it up in browser like this :

![homepage preview](https://rino.world/api/convertimage?url=https://imgur.com/download/HXrfLp0)

# Step 3 - Create Login Page To Authorize User Github Account

After you create homepage let's create login page this login page is used for login to github and get the private repo create `pages/login.vue` and add this code :

```
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
```

We need to use fontawesome icon to make our login page more beautiful so download this using this command :

```
yarn add -D @fortawesome/fontawesome-free
```

Modify nuxt.config.js adding to the vuetify section.

```
vuetify: {
    defaultAssets: {icons: 'fa'},
```

Now create `components/Login.vue` and add this code :

```
<template>

   <v-row justify="center" align="center">
<v-card>
  <v-card-text>
    <v-row :class="['my-3','mx-3','text-h4']">LOGIN USING YOUR GITHUB ACCOUNT</v-row>
    <v-row align="center" justify="center">
      <v-btn><v-icon class="mx-2 my-2">fab fa-github</v-icon>LOGIN</v-btn>
    </v-row>
  </v-card-text>
</v-card>
   </v-row>

</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
@Component
export default class MyStore extends Vue {}
</script>
```

Go to `http://localhost:3000/login` and you will see your login page look something like this :

![login page](https://rino.world/api/convertimage?url=https://imgur.com/download/vGCiP6L)

Now we need to create github oauth apps so that our application can login throught github and get personal repo of a user if you haven't create one follow the instruction [here](https://docs.github.com/en/free-pro-team@latest/developers/apps/creating-a-github-app) pick oauth apps because we just need the oauth to get the user private repo :

![oauth apps](https://rino.world/api/convertimage?url=https://imgur.com/download/BMC7ZMf)

For the authorization url we gonna use IBM Cloud Function and IBM Cloudant NoSQL DB so that we can store the access token to be used later, so in order to do this install IBM Cli using this [instruction](https://cloud.ibm.com/docs/cli?topic=cli-install-ibmcloud-cli) if you have installed it login to your console and go to this [link](https://cloud.ibm.com/functions/cli) follow the instruction there and if there is an error like this :

![error region](https://rino.world/api/convertimage?url=https://imgur.com/download/2DaXF9w)

That means you haven't setup a region to determine which region you're based on go to the top of this [link](https://cloud.ibm.com/functions/cli) and you can find your region under namespace like this :

![region](https://rino.world/api/convertimage?url=https://imgur.com/download/JghjKpw)

You can find your region name by using command `ibmcloud regions` then after that set your region by using this command :

```
ibmcloud target -r <region code>
ibmcloud target -o <org> -s <space>
ibmcloud wsk property get --auth
```

Now we gonna install `serverless` cli to upload our function much more easier go ahead and run this command in your command line :

```
npm install -g serverless
```

Now go to the root of your folder and type this command :

```
serverless create --template openwhisk-nodejs --path functions
cd functions
```

Now let's rename `handler.js` into `authorize.js` so that it's easier for us to remember that this function is for authorize github account before we create our function let's create cloudant db first if you haven't create one follow [this](https://cloud.ibm.com/docs/Cloudant) tutorial to get started don't forget to create credential for your cloudant db by clicking service credential menu on cloudant db dashboard :

![cloudant service account](https://rino.world/api/convertimage?url=https://imgur.com/download/Uohvb4j)

After that run this command to select group :

```
# you can find group name by running command `ibmcloud resource groups`
ibmcloud target -g <group name>
```

Then now in `functions` folder change the code of `serverless.yml` file into this :

```
service: authorize
useDotenv: true
provider:
  name: openwhisk
  ignore_certs: true

functions:
  authorize-github:
    handler: authorize.github
    parameters:
      github_client_id: ${env:github_client_id}
      github_client_secret: ${env:github_client_secret}
    bind:
      - service:
          name: cloudantnosqldb
          instance: Cloudant-vm
    events:
      - http: GET /authorize

plugins:
  - serverless-openwhisk
  - serverless-dotenv-plugin
```

Create a file called `.env` then add this line :

```
github_client_id=<github client_id>
github_client_secret=<github client_secret>
token_pass=<token password for jwt token could be random>
frontend_url=<url of your static web hosting>
```

Let's download the necessary dependencies first :

```
yarn add axios
yarn add -D serverless-dotenv-plugin serverless-openwhisk
```

Now let's create function to authorize our user open `authorize.js` and change the code to this one :

```
"use strict";
const axios = require("axios");
const jwt = require("jsonwebtoken");
const formUrlEncoded = (x) =>
  Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, "");
const github = async function (params) {
  const cloudant = require("@cloudant/cloudant")({
    url: params.__bx_creds.cloudantnosqldb.url,
    plugins: [
      { iamauth: { iamApiKey: params.__bx_creds.cloudantnosqldb.apikey } },
    ],
  });
  if (params.code) {
    const { access_token } = await authenticate({ params });
    const { login,email } = await getUsername({ access_token });
    const {token} = await checkUsername({
      email,
      username: login,
      cloudant,
      access_token,
      token_pass: params.token_pass,
    });
    
    if(token){
      return  {
        headers: { location: `${params.frontend_url}/dashboard` },
        statusCode: 302
        };
    }else{
      return  {
        headers: { location: params.frontend_url },
        statusCode: 302
        };
    }
    
  } else {
    return {
      headers: { location: `${params.frontend_url}/login` },
      statusCode: 302
      };
  }
};
module.exports.github = github;
async function authenticate({ params }) {
  const { data } = await axios({
    url: "https://github.com/login/oauth/access_token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    data: formUrlEncoded({
      client_id: params.github_client_id,
      client_secret: params.github_client_secret,
      code: params.code,
    }),
    method: "POST",
  });
  return data;
}
async function getUsername({ access_token }) {
  const { data } = await axios({
    url: "https://api.github.com/user",
    headers: {
      Authorization: `token ${access_token}`,
      Accept: "application/vnd.github.v3+json",
    },
    method: "GET",
  });
  return data;
}
async function checkUsername({ username, access_token, cloudant, token_pass,email }) {
  const token = jwt.sign({ access_token }, token_pass);
  const db = cloudant.db.use("ecommerce");
  const query = {
    selector: {
      $and: [{ username: { $eq: username } }, { collection: { $eq: "user" } }],
    },
  };

  const res = await db.find(query);
  if (res.docs.length === 1) {
    const { _id, _rev } = res.docs[0];
    const user = {
      _id,
      _rev,
      username,
      access_token,
      token,
      email,
      collection: "user",
    };
    
    const {ok}= await db.insert(user);
     return ok && {token};
  } else {
    const user = { username,email, access_token, token, collection: "user" };
    const {ok}=await db.insert(user);
    return ok && {token};
    
  }
}

```

After you done setting up IBM cloud functions run this command to deploy it :

```
serverless deploy
```

Copy the URL you got from `serverless deploy` for github authorization callback url :

![url](https://rino.world/api/convertimage?url=https://imgur.com/download/OFIQlGz)

![authorization callback](https://rino.world/api/convertimage?url=https://imgur.com/download/l1Bu4BI)

After you done let's go back to root folder then go to `frontend` folder download this dependencies to get environment variable from a file :

```
yarn add @nuxtjs/dotenv
```

Then in `nuxt.config.js` add this line :

```
 buildModules: [
...
    '@nuxtjs/dotenv'
  ],
```

Add `.env` file in the `frontend` folder and add this line :

```
github_client_id=<your github client id>
```

After that go to `components/Login.vue` then change the button html to this one :

```
...
 <v-btn @click="login_github"><v-icon class="mx-2 my-2">fab fa-github</v-icon>LOGIN</v-btn>
...
```

And add script to `components/Login.vue` like this one :

```
export default class MyStore extends Vue {
  login_github(){
    window.location.href="https://github.com/login/oauth/authorize?client_id="+process.env.github_client_id
  }
}
```

Now create file in `pages/callback.vue` to receive token and set it in cookies like this :

```
<template>
  <v-row justify="center" align="center" :class="['text-h1']">REDIRECTING...</v-row>
</template>
<script lang="ts">
import Cookies from 'js-cookie'
import { Component, Vue } from 'nuxt-property-decorator'
@Component
export default class MyStore extends Vue {
  mounted(){
Cookies.set('token', this.$route.query.token)
window.location.href="/"
  }
}
</script>
```

And then change the script in `pages/index.vue` to implement if there is token in the cookies remove the login button in homepage and change it to Dashboard button and logout button

```
// pages/index.vue
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
  public login: boolean =
    Cookies.get('token') && Cookies?.get('token')?.trim() !== ''
      ? true
      : false
}
</script>
```

After that change the `components/Home.vue` to implement button change like this :

```
// components/Home.vue
<template>
...
 <v-btn :class="['my-2']" color="info" elevation="2" v-show="login"
        >DASHBOARD</v-btn
      >
      <v-btn
        :class="['my-2']"
        color="info"
        elevation="2"
        href="/login"
        v-show="!login"
        >LOGIN</v-btn
      >
      <v-btn
        :class="['my-2', 'mx-2']"
        color="error"
        elevation="2"
        v-show="login"
        >LOGOUT</v-btn
      >
...
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
@Component
export default class MyStore extends Vue {
  @Prop({ required: true }) readonly login!: boolean
}
</script>
```

And now generate the frontend just like before and rclone it :

```
yarn generate
cd dist
rclone copy ./ <remote name>:<bucket name>
```

Go to your browser and open your public static web hosting url try to login using your github account and if you see something like this below then your authorization is done and you are successfully deploy serverless auth using IBM cloud function and save the token in IBM cloudant :

![auth finish](https://rino.world/api/convertimage?url=https://imgur.com/download/uKcOTmq)

# Step 4 - Create Dashboard To Get Private Repo

First of all we need to change the `Home.vue` in `frontend` folder go to `components/Home.vue` and change the button so that it can go to dashboard and logout :

```
<template>
...
 <v-btn
        :class="['my-2']"
        color="info"
        elevation="2"
        v-show="login"
        href="/dashboard"
        >DASHBOARD</v-btn
      >
      ...
      <v-btn
        :class="['my-2', 'mx-2']"
        color="error"
        elevation="2"
        v-show="login"
        @click="logout"
        >LOGOUT</v-btn
      >
...
</template>
<script lang="ts">
import Cookies from 'js-cookie'
...
export default class MyStore extends Vue {
  @Prop({ required: true }) readonly login!: boolean
  logout() {
    Cookies.remove('token')
window.location.reload()
  }
}
...
</script>
```

Now let's create `pages/dashboard.vue` to handle our Dashboard.vue component

```
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
  public login: boolean =
    Cookies.get('token') && Cookies?.get('token')?.trim() !== ''
      ? true
      : false
}
</script>
```

And if that finish now let's create `components/Dashboard.vue` to show balance and to show our private repo later

```
<template>
  <v-container>
    <v-row justify="space-between">
      <v-col cols="4" class="text-h4 font-weight-bold">Dashboard</v-col>
      <v-col cols="4" class="d-flex justify-end"
        ><v-btn @click="logout">LOGOUT</v-btn></v-col
      >
    </v-row>
    <DashboardInfo :username="username" :profilePhoto="profilePhoto" />
    <v-row justify="space-between">
      <v-col cols="4" class="text-h4 font-weight-bold">Private Repo List</v-col>
    </v-row>
    <DashboardRepo :refreshRepo="getPrivateRepo" :listRepo="privateRepo" />
    <v-row justify="space-between">
      <v-col cols="4" class="text-h4 font-weight-bold">Owned Repo</v-col>
    </v-row>
    <DashboardRepo :refreshRepo="getOwnedRepo" :listRepo="ownedRepo" />
  </v-container>
</template>

<script lang="ts">
import Cookies from 'js-cookie'
import DashboardInfo from '@/components/dashboard_components/DashboardInfo.vue'
import DashboardRepo from '@/components/dashboard_components/DashboardRepo.vue'
import { Component, Vue, Prop } from 'nuxt-property-decorator'
@Component({
  components: {
    DashboardInfo,
    DashboardRepo,
  },
})
export default class MyStore extends Vue {
  @Prop({ required: true }) readonly login!: boolean
  public username: string = ''
  public profilePhoto: string = ''
  public privateRepo: Array<object> = []
  public ownedRepo: Array<object> = []
  logout() {
    Cookies.remove('token')
    window.location.href = '/'
  }
  async created() {
    // if (!this.login) window.location.href = '/'
    const token = Cookies.get('token')
    const url = process.env.get_profile_url
    const privateRepoUrl = process.env.get_private_repo_url
    const ownedRepoUrl = process.env.get_owned_repo_url
    const {data} = await this.$axios.get(`${url}?token=${token}`)
    const privateRepo = await this.$axios.get(`${privateRepoUrl}?token=${token}`)
    const ownedRepo = await this.$axios.get(`${ownedRepoUrl}?token=${token}`)
    this.username = data.data.login
    this.profilePhoto = data.data.avatarUrl
    this.privateRepo=privateRepo.data
    this.ownedRepo=ownedRepo.data
  }
  async getPrivateRepo() {
    const token = Cookies.get('token')
    const url = process.env.get_private_repo_refresh_url
    const {data} = await this.$axios.get(`${url}?token=${token}`)
    this.privateRepo=data.data

  }

}
</script>
```

This is how our dashboard will look like for now :

![dashboard](https://rino.world/api/convertimage?url=https://imgur.com/download/mN3NjSY)

After that let's change the github oauth url to enable our api token to get our private repo go to `components/login.vue` then change the script into this :

```
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
@Component
export default class MyStore extends Vue {
  login_github(){
    window.location.href="https://github.com/login/oauth/authorize?scope=repo&client_id="+process.env.github_client_id
  }
}
</script>
```

It will now show authorization url that will grant an access to our private and public repo, but since this is a private repo marketplace, then we gonna get private repo only, now go back to `functions` folder and create an IBM cloud function that can get our private repo,get profile,and get repo that we bought from other github user, create a file called `private_repo.js` and write this code :

```
"use strict";
const axios = require("axios");
const jwt = require("jsonwebtoken");
const formUrlEncoded = (x) =>
  Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, "");
const privateRepoRefresh = async function (params) {
  const cloudant = require("@cloudant/cloudant")({
    url: params.__bx_creds.cloudantnosqldb.url,
    plugins: [
      { iamauth: { iamApiKey: params.__bx_creds.cloudantnosqldb.apikey } },
    ],
  });

  const data = await getPrivateRepoRefresh({
    cloudant,
    token: params.token,
    token_pass: params.token_pass,
  });

  if (data&&data.length>0) {
    return {
      data,
    };
  } else {
    return {
      data: [],
    };
  }
};
const privateRepo = async function (params) {
  const cloudant = require("@cloudant/cloudant")({
    url: params.__bx_creds.cloudantnosqldb.url,
    plugins: [
      { iamauth: { iamApiKey: params.__bx_creds.cloudantnosqldb.apikey } },
    ],
  });

  const data = await getPrivateRepo({
    cloudant,
    token: params.token,
    token_pass: params.token_pass,
  });

  if (data&&data.length>0) {
    return {
      data,
    };
  } else {
    return {
      data: [],
    };
  }
};
const ownedRepo = async function (params) {
  const cloudant = require("@cloudant/cloudant")({
    url: params.__bx_creds.cloudantnosqldb.url,
    plugins: [
      { iamauth: { iamApiKey: params.__bx_creds.cloudantnosqldb.apikey } },
    ],
  });

  const data = await getOwnedRepo({
    cloudant,
    token: params.token,
    token_pass: params.token_pass,
  });

  if (data&&data.length>0) {
    return {
      data,
    };
  } else {
    return {
      data: [],
    };
  }
};

const profile = async function (params) {
  const cloudant = require("@cloudant/cloudant")({
    url: params.__bx_creds.cloudantnosqldb.url,
    plugins: [
      { iamauth: { iamApiKey: params.__bx_creds.cloudantnosqldb.apikey } },
    ],
  });

  const data = await getProfile({
    cloudant,
    token: params.token,
    token_pass: params.token_pass,
  });

  if (data) {
    return {
      data: data.data.viewer,
    };
  } else {
    return {
      data: {},
    };
  }
};
module.exports.profile = profile;
module.exports.privateRepo = privateRepo;
module.exports.ownedRepo = ownedRepo;
module.exports.privateRepoRefresh = privateRepoRefresh;
async function getProfile({ cloudant, token_pass, token }) {
  const { access_token } = jwt.verify(token, token_pass);
  const db = cloudant.db.use("ecommerce");
  var query = {
    selector: { access_token: { $eq: access_token } },
    fields: ["access_token"],
  };

  const res = await db.find(query);
  if (res.docs.length === 1) {
    const { data } = await axios({
      url: "https://api.github.com/graphql",
      headers: {
        Authorization: `token ${res.docs[0].access_token}`,
        Accept: "application/vnd.github.v3+json",
      },
      method: "POST",
      data: { query: "query { viewer { login,avatarUrl }}" },
    });
    return data;
  } else {
    return null;
  }
}

async function getPrivateRepoRefresh({ cloudant, token_pass, token }) {
  const { access_token } = jwt.verify(token, token_pass);
  const db = cloudant.db.use("ecommerce");
  var query = {
    selector: { $and:[{access_token: { $eq: access_token } },{collection:{$eq:"user"}}]},
    fields: ["access_token", "username"],
  };

  const res = await db.find(query);
  if (res.docs.length === 1) {
    const { data } = await axios({
      url: "https://api.github.com/graphql",
      headers: {
        Authorization: `token ${res.docs[0].access_token}`,
        Accept: "application/vnd.github.v3+json",
      },
      method: "POST",
      data: {
        query: `{
        repositoryOwner(login: "${res.docs[0].username}") {
          repositories(privacy: PRIVATE,first:5,orderBy:{field:CREATED_AT,direction:DESC}) {
            nodes {
              description
              name
              openGraphImageUrl
              url
              id
            }
          }
        }
      }
      `,
      },
    });
    const nodes = data.data.repositoryOwner.repositories.nodes;
    for (let i = 0; i < nodes.length; i++) {
      const findRepo = await db.find({
        selector: {
          $and: [
            { username: { $eq: res.docs[0].username } },
            { collection: { $eq: "private-repo" } },
            { repo_id: { $eq: nodes[i].id } },
          ],
        },
      });
      if(findRepo.docs.length>0){
        const {_id,_rev,...other}=findRepo.docs[0]
        const {id,...rest}=nodes[i];
        const repoData={_id,_rev,repo_id:id,...rest,...other}
        await db.insert(repoData)
      }else{
        const {id,...rest}=nodes[i];
        const repoData={repo_id:id,...rest,username:res.docs[0].username,collection:"private-repo",sell:"UNLIST",amount:0}
        await db.insert(repoData)
      }
    }

    const final = await db.find({
      selector: {
        $and: [
          { username: { $eq: res.docs[0].username } },
          { collection: { $eq: "private-repo" } },
        ],
      },
    });
    return final.docs;
  } else {

    return [];
  }
}
async function getPrivateRepo({ cloudant, token_pass, token }) {
  const { access_token } = jwt.verify(token, token_pass);
  const db = cloudant.db.use("ecommerce");
  var query = {
    selector: { $and:[{access_token: { $eq: access_token } },{collection:{$eq:"user"}}]},
    fields: ["access_token", "username"],
  };

  const res = await db.find(query);
  if(res.docs.length===1){
    const final = await db.find({
      selector: {
        $and: [
          { username: { $eq: res.docs[0].username } },
          { collection: { $eq: "private-repo" } },
        ],
      },
    });
    return final.docs;
  }else{
    return []
  }
  
}
async function getOwnedRepo({ cloudant, token_pass, token }) {
  const { access_token } = jwt.verify(token, token_pass);
  const db = cloudant.db.use("ecommerce");
  var query = {
    selector: { $and:[{access_token: { $eq: access_token } },{collection:{$eq:"user"}}]},
    fields: ["access_token", "username"],
  };

  const res = await db.find(query);
  if(res.docs.length===1){
    const final = await db.find({
      selector: {
        $and: [
          { username: { $eq: res.docs[0].username } },
          { collection: { $eq: "owned-repo" } },
        ],
      },
    });
    return final.docs;
  }else{
    return []
  }
  
}
```

Change `serverless.yml` to suit our needs like this :

```
service: authorize
useDotenv: true
provider:
  name: openwhisk
  ignore_certs: true

functions:
  authorize-github:
    handler: authorize.github
    annotations:
      web-export: true
    parameters:
      github_client_id: ${env:github_client_id}
      github_client_secret: ${env:github_client_secret}
      token_pass: ${env:token_pass}
      frontend_url: ${env:frontend_url}
    bind:
      - service:
          name: cloudantnosqldb
          instance: Cloudant-vm
  get-private-repo:
    handler: private_repo.privateRepo
    parameters:
      github_client_id: ${env:github_client_id}
      github_client_secret: ${env:github_client_secret}
      token_pass: ${env:token_pass}
      frontend_url: ${env:frontend_url}
    events: 
      - http: GET /get-private-repo
    bind:
      - service:
          name: cloudantnosqldb
          instance: Cloudant-vm
  get-private-repo-refresh:
    handler: private_repo.privateRepoRefresh
    parameters:
      github_client_id: ${env:github_client_id}
      github_client_secret: ${env:github_client_secret}
      token_pass: ${env:token_pass}
      frontend_url: ${env:frontend_url}
    events: 
      - http: GET /get-private-repo-refresh
    bind:
      - service:
          name: cloudantnosqldb
          instance: Cloudant-vm
  get-owned-repo:
    handler: private_repo.ownedRepo
    parameters:
      github_client_id: ${env:github_client_id}
      github_client_secret: ${env:github_client_secret}
      token_pass: ${env:token_pass}
      frontend_url: ${env:frontend_url}
    events: 
      - http: GET /get-owned-repo
    bind:
      - service:
          name: cloudantnosqldb
          instance: Cloudant-vm
  get-profile:
    handler: private_repo.profile
    parameters:
      github_client_id: ${env:github_client_id}
      github_client_secret: ${env:github_client_secret}
      token_pass: ${env:token_pass}
      frontend_url: ${env:frontend_url}
    events: 
      - http: GET /get-profile
    bind:
      - service:
          name: cloudantnosqldb
          instance: Cloudant-vm              

plugins:
  - serverless-openwhisk
  - serverless-dotenv-plugin
```

Now let's deploy it using `serverless` command line like this :

```
serverless deploy
```

Now let's change our Dashboard.vue so that it can show our private repo :

```
<template>
  <v-container>
    <v-row justify="space-between">
      <v-col cols="4" class="text-h4 font-weight-bold">Dashboard</v-col>
      <v-col cols="4" class="d-flex justify-end"
        ><v-btn @click="logout">LOGOUT</v-btn></v-col
      >
    </v-row>
    <DashboardInfo :username="username" :profilePhoto="profilePhoto" />
    <v-row justify="space-between">
      <v-col cols="4" class="text-h4 font-weight-bold">Private Repo List</v-col>
    </v-row>
    <DashboardRepo :refreshRepo="getPrivateRepo" :listRepo="privateRepo" />
    <v-row justify="space-between">
      <v-col cols="4" class="text-h4 font-weight-bold">Owned Repo</v-col>
    </v-row>
    <DashboardRepo  :listRepo="ownedRepo" />
  </v-container>
</template>

<script lang="ts">
import Cookies from 'js-cookie'
import DashboardInfo from '@/components/dashboard_components/DashboardInfo.vue'
import DashboardRepo from '@/components/dashboard_components/DashboardRepo.vue'
import { Component, Vue, Prop } from 'nuxt-property-decorator'
@Component({
  components: {
    DashboardInfo,
    DashboardRepo,
  },
})
export default class MyStore extends Vue {
  @Prop({ required: true }) readonly login!: boolean
  public username: string = ''
  public profilePhoto: string = ''
  public privateRepo: Array<object> = []
  public ownedRepo: Array<object> = []
  logout() {
    Cookies.remove('token')
    window.location.href = '/'
  }
  async created() {
    // if (!this.login) window.location.href = '/'
    const token = Cookies.get('token')
    const url = process.env.get_profile_url
    const privateRepoUrl = process.env.get_private_repo_url
    const ownedRepoUrl = process.env.get_owned_repo_url
    const {data} = await this.$axios.get(`${url}?token=${token}`)
    const privateRepo = await this.$axios.get(`${privateRepoUrl}?token=${token}`)
    const ownedRepo = await this.$axios.get(`${ownedRepoUrl}?token=${token}`)
    this.username = data.data.login
    this.profilePhoto = data.data.avatarUrl
    this.privateRepo=privateRepo.data.data
    this.ownedRepo=ownedRepo.data.data
  }
  async getPrivateRepo() {
    const token = Cookies.get('token')
    const url = process.env.get_private_repo_refresh_url
    const {data} = await this.$axios.get(`${url}?token=${token}`)
    this.privateRepo=data.data

  }

}
</script>
```

Also create `components/dashboard_components/DashboardRepo.vue` component to show our private repo and owned repo :

```
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

```

Create `components/dashboard_components/DashboardInfo.vue` component to show username, profile picture and balance :

```
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
              <v-col class="font-weight-bold text-h5">$ 1000</v-col>
              <v-col><v-btn color="green">withdraw</v-btn></v-col>
            </v-row>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </v-row>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
@Component
export default class MyStore extends Vue {
  @Prop({ required: true }) readonly username!: string
  @Prop({ required: true }) readonly profilePhoto!: string

}
</script>
```

Go to `http://localhost:3000/dashboard` and you will see something like this if you're successfully shown your private repo :

![dashboard](https://rino.world/api/convertimage?url=https://imgur.com/download/kqDH9Q9)

# Step 5 - Create Function That Can Sell And Buy Repo

Create a file called `sell_repo.js` on `functions` folder we gonna use this file to inform the application that our repo is for sale,unlist repo for sale, and sell repo:

```
const axios = require("axios");
const jwt = require("jsonwebtoken");
const sell_repo = async function (params) {
    const cloudant = require("@cloudant/cloudant")({
      url: params.__bx_creds.cloudantnosqldb.url,
      plugins: [
        { iamauth: { iamApiKey: params.__bx_creds.cloudantnosqldb.apikey } },
      ],
    });
  
    const data = await sellRepo({
      cloudant,
      token: params.token,
      token_pass: params.token_pass,
      _id:params._id,
      amount:params.amount,
      
    });
  
    if (data && data.length>0) {
      return {
        data
      };
    } else {
      return {
        data,
      };
    }
  };
  const unlist_repo = async function (params) {
    const cloudant = require("@cloudant/cloudant")({
      url: params.__bx_creds.cloudantnosqldb.url,
      plugins: [
        { iamauth: { iamApiKey: params.__bx_creds.cloudantnosqldb.apikey } },
      ],
    });
  
    const data = await unlistRepo({
      cloudant,
      token: params.token,
      token_pass: params.token_pass,
      _id:params._id,
      
    });
  
    if (data && data.length>0) {
      return {
        data
      };
    } else {
      return {
        data,
      };
    }
  };
  const for_sale_repo = async function (params) {
    const cloudant = require("@cloudant/cloudant")({
      url: params.__bx_creds.cloudantnosqldb.url,
      plugins: [
        { iamauth: { iamApiKey: params.__bx_creds.cloudantnosqldb.apikey } },
      ],
    });
  
    const data = await forSaleRepo({
      cloudant,
      token: params.token,
      token_pass: params.token_pass,
      
      
    });
  
    if (data && data.length>0) {
      return {
        data
      };
    } else {
      return {
        data,
      };
    }
  };
  async function sellRepo({ cloudant, token_pass, token,_id,amount}) {
    const { access_token } = jwt.verify(token, token_pass);
    const db = cloudant.db.use("ecommerce");
    var query = {
      selector: { $and:[{access_token: { $eq: access_token } },{collection:{$eq:"user"}}]},
      fields: ["access_token", "username"],
    };
  
    const res = await db.find(query);
    if(res.docs.length===1){
      let repo = await db.find({
        selector: {
          _id:{$eq:_id}
        },
      });
      if(repo.docs.length===1){
        repo.docs[0].amount=amount;
        repo.docs[0].sell="SELL";
        await db.insert(repo.docs[0])
        const final=await db.find({selector:{username:res.docs[0].username,collection:"private-repo"}})
        return final.docs
      }else{
        return {status:false,data:[],message:"error selling"}
      }
      
    }else{
      return {status:false,data:[],message:"error token"}
    }
    
  }
  async function unlistRepo({ cloudant, token_pass, token,_id }) {
    const { access_token } = jwt.verify(token, token_pass);
    const db = cloudant.db.use("ecommerce");
    var query = {
      selector: { $and:[{access_token: { $eq: access_token } },{collection:{$eq:"user"}}]},
      fields: ["access_token", "username"],
    };
  
    const res = await db.find(query);
    if(res.docs.length===1){
      let repo = await db.find({
        selector: {
          _id:{$eq:_id}
        },
      });
      if(repo.docs.length===1){
        repo.docs[0].sell="UNLIST";
        await db.insert(repo.docs[0])
        const final=await db.find({selector:{username:res.docs[0].username,collection:"private-repo"}})
        return final.docs
      }else{
        return {status:false,data:[],message:"error unlist"}
      }
      
    }else{
      return {status:false,data:[],message:"error token"}
    }
    
  }
  async function forSaleRepo({ cloudant, token_pass, token }) {
    const { access_token } = jwt.verify(token, token_pass);
    const db = cloudant.db.use("ecommerce");
    var query = {
      selector: { $and:[{access_token: { $eq: access_token } },{collection:{$eq:"user"}}]},
      fields: ["access_token", "username"],
    };
  
    const res = await db.find(query);
    if(res.docs.length===1){
      let repo = await db.find({
        selector: {
          collection:{$eq:"private-repo"},
          sell:"SELL"
        },
      });
      return repo.docs
            
    }else{
      return {status:false,data:[],message:"error token"}
    }
    
  }
  module.exports.sell_repo = sell_repo;
  module.exports.unlist_repo = unlist_repo;
  module.exports.for_sale_repo = for_sale_repo;
```

Now let's change our `components/Dashboard.vue` to implement our cloud function like this :

```
<template>
  <v-container>
    <v-row justify="space-between">
      <v-col cols="4" class="text-h4 font-weight-bold">Dashboard</v-col>
      <v-col cols="4" class="d-flex justify-end"
        ><v-btn @click="logout">LOGOUT</v-btn></v-col
      >
    </v-row>
    <DashboardInfo :username="username" :profilePhoto="profilePhoto" />
    <v-row justify="space-between">
      <v-col cols="4" class="text-h4 font-weight-bold">Private Repo List</v-col>
    </v-row>
    <DashboardRepo
      :refreshRepo="getPrivateRepo"
      :listRepo="privateRepo"
      @sell-repo="sellRepo($event._id, $event.amount)"
      @unlist-repo="unlistRepo($event._id)"
    />
    <v-row justify="space-between">
      <v-col cols="4" class="text-h4 font-weight-bold">Owned Repo</v-col>
    </v-row>
    <DashboardRepo :listRepo="ownedRepo" />
    <v-snackbar v-model="snackbarAmount">
      the amount shouldn't be negative or zero
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import Cookies from 'js-cookie'
import DashboardInfo from '@/components/dashboard_components/DashboardInfo.vue'
import DashboardRepo from '@/components/dashboard_components/DashboardRepo.vue'
import { Component, Vue, Prop } from 'nuxt-property-decorator'
@Component({
  components: {
    DashboardInfo,
    DashboardRepo,
  },
})
export default class MyStore extends Vue {
  @Prop({ required: true }) readonly login!: boolean
  public username: string = ''
  public profilePhoto: string = ''
  public snackbarAmount: boolean = false
  public privateRepo: Array<object> = []
  public ownedRepo: Array<object> = []
  logout() {
    Cookies.remove('token')
    window.location.href = '/'
  }
  async created() {
    // if (!this.login) window.location.href = '/'
    const token = Cookies.get('token')
    const url = process.env.get_profile_url
    const privateRepoUrl = process.env.get_private_repo_url
    const ownedRepoUrl = process.env.get_owned_repo_url
    const { data } = await this.$axios.get(`${url}?token=${token}`)
    const privateRepo = await this.$axios.get(
      `${privateRepoUrl}?token=${token}`
    )
    const ownedRepo = await this.$axios.get(`${ownedRepoUrl}?token=${token}`)
    this.username = data.data.login
    this.profilePhoto = data.data.avatarUrl
    this.privateRepo = privateRepo.data.data
    this.ownedRepo = ownedRepo.data.data
  }
  async getPrivateRepo() {
    const token = Cookies.get('token')
    const url = process.env.get_private_repo_refresh_url
    const { data } = await this.$axios.get(`${url}?token=${token}`)
    this.privateRepo = data.data
  }
  async sellRepo(_id: string, amount: number) {
    // console.log(amount)
    if (Number(amount) === 0 || Number(amount) < 0) {
      console.log(amount)
      this.snackbarAmount = true
      return
    } else {
      const token = Cookies.get('token')
      const url = process.env.sell_repo_url

      const { data } = await this.$axios.post(`${url}?token=${token}`, {
        _id,
        amount,
      })
      this.privateRepo = data.data
    }
  }
  async unlistRepo(_id: string) {
    const token = Cookies.get('token')
    const url = process.env.unlist_repo_url
    const { data } = await this.$axios.post(`${url}?token=${token}`, { _id })
    this.privateRepo = data.data
  }
}
</script>
```

Also change the `components/dashboard_components/DashboardRepo.vue` so that it can show the list of private repo after clicking sell button :

```
<template>
  <div>
    <v-row class="mb-2" v-if="refreshRepo"><v-btn @click="refreshRepo">Refresh Repo List</v-btn></v-row>
    <v-row>
      <v-card width="400" class="mx-2 my-2" :key=index v-for="(item,index) in listRepo">
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
            <v-col cols="5" class="d-flex justify-start align-content-center">
              <div class="d-flex align-center text-h5" :style="{height:'100%'}" v-if="item.sell==='SELL'">$ {{item.amount}}</div>
              <v-text-field
              v-if="item.sell==='UNLIST'"
                label="Amount"
                type="number"
                outlined
                prefix="$"
                v-model="amount"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex mt-2 justify-end">
              <v-btn @click="sellRepo(item._id,amount)" color="red" v-if="item.sell==='UNLIST'">SELL</v-btn><v-btn v-if="item.sell==='SELL'" @click="unlistRepo(item._id)">UNLIST</v-btn>
            </v-col>
          </v-row></v-card-action
        >
      </v-card>
    </v-row>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop,Emit } from 'nuxt-property-decorator'
@Component
export default class MyStore extends Vue {
  @Prop({ required: false }) readonly refreshRepo!: void
  @Prop({ required: true }) readonly listRepo!: Array<object>
  public amount:number
  @Emit()
sellRepo(_id: string,amount:number) {
return {_id,amount}
}
  @Emit()
unlistRepo(_id: string) {
return {_id}
}
}
</script>

```

Now go to `Home.vue` so that we can show our for sale repo after clicking it :

```
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
      <v-btn
        :class="['my-2']"
        color="info"
        elevation="2"
        v-show="login"
        href="/dashboard"
        >DASHBOARD</v-btn
      >
      <v-btn
        :class="['my-2']"
        color="info"
        elevation="2"
        href="/login"
        v-show="!login"
        >LOGIN</v-btn
      >
      <v-btn
        :class="['my-2', 'mx-2']"
        color="error"
        elevation="2"
        v-show="login"
        @click="logout"
        >LOGOUT</v-btn
      >
    </v-row>
    <v-row>
      <v-card class="mx-auto my-12" max-width="374" :key="index" v-for="(item,index) in forSale">
        <v-img
          height="250"
          :src="item.openGraphImageUrl"
        ></v-img>

        <v-card-title>{{item.name}}</v-card-title>

        <v-card-text>

          <div>{{item.description}}</div>
        </v-card-text>

        <v-divider class="mx-4"></v-divider>

        <v-card-actions>
          <v-flex>$ {{item.amount}}</v-flex>
          <v-flex ><div class="d-flex justify-end"><v-btn class="d-flex justify-end" color="deep-purple lighten-2" @click="buyNow(item._id,item.amount)" text> Buy Now </v-btn>
            </div></v-flex>

        </v-card-actions>
      </v-card>
    </v-row>
  </div>
</template>
<script lang="ts">
import Cookies from 'js-cookie'
import { Component, Vue, Prop } from 'nuxt-property-decorator'
@Component
export default class MyStore extends Vue {
  @Prop({ required: true }) readonly login!: boolean
  public forSale:Array<object>=[]
  logout() {
    Cookies.remove('token')
    window.location.reload()
  }
  async created(){
  const token = Cookies.get('token')
    const url = process.env.for_sale_repo_url
    const { data } = await this.$axios.get(`${url}?token=${token}`)
    this.forSale = data.data
  }
  async buyNow(_id,amount){

  }
}
</script>
```

Now you can sell your repo when you put the amount and clicking sell button like this :

![sell](https://rino.world/api/convertimage?url=https://imgur.com/download/txjAAUk)

Then when you go to homepage it also shown the price and buy button :

![buy shop](https://rino.world/api/convertimage?url=https://imgur.com/download/PzKIZ86)

# Step 6 - Integrate Paypal To Accept Payment

First create sandbox paypal account [here](https://developer.paypal.com/developer/accounts/), after that create a demo account on developer account :

![demo account](https://rino.world/api/convertimage?url=https://imgur.com/download/AUne0sZ)

Then let's change our balance UI into a button that can accept paypal payment go to `frontend` folder and go to `components/dashboard_components/DashboardInfo.vue` and change the balance UI like this :

```
...
<v-row justify="space-between">
              <v-col><v-btn color="green" v-if="!paypalToken">CONNECT PAYPAL</v-btn></v-col>
              <v-col class="font-weight-bold text-h5" v-if="paypalToken">{{paypalBalance}}</v-col>
              <v-col v-if="paypalToken"><v-btn color="green">withdraw</v-btn></v-col>
            </v-row>
...
<script lang="ts">
...
    @Prop({ required: false }) readonly paypalBalance!: string
    @Prop({ required: true }) readonly paypalToken!: boolean
...
</script>
```

Also in the `components/Home.vue` add this code :

```
<template>
...
  <DashboardInfo :username="username" :profilePhoto="profilePhoto" :paypalToken="paypalToken"/>
...
</template>
<script lang=ts>
...
public paypalToken: boolean = false
...
</script>
```

it will now look like this :

![home.vue](https://rino.world/api/convertimage?url=https://imgur.com/download/JSkOxW4)

Now we need to add function to make that button connect to our paypal so that we can see our balance in return, also we will make a condition so that when the paypal connected, we can sell the repo, but when it doesn't connect, it can't sell the repo go ahead and change `frontend/components/dashboard_components/DashboardRepo.vue` to this :

```
<template>
  <div>
    <v-row class="mb-2" v-if="refreshRepo"
      ><v-btn @click="refreshRepo">Refresh Repo List</v-btn></v-row
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
                v-if="item.sell === 'SELL'"
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
                v-if="item.sell === 'UNLIST'"
                :disabled="!paypalToken"
                >SELL</v-btn
              ><v-btn :disabled="!paypalToken" v-if="item.sell === 'SELL'" @click="unlistRepo(item._id)"
                >UNLIST</v-btn
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

```

Now whenever the paypal button not connected the sell button is disabled

![disabled](https://rino.world/api/convertimage?url=https://imgur.com/download/AJ1HaZy)

Let's now create a function that can send money through paypal when buying one of the repo,now create a read access to that repo,now go to `functions` folder and create `manage_access.js`

```
"use strict";
const axios = require("axios");
const jwt = require("jsonwebtoken");
function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
const formUrlEncoded = (x) =>
  Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, "");
const paypal = require("@paypal/checkout-server-sdk");
const buy_paypal = async function (params) {
  const random = makeid(5);
  const cloudant = require("@cloudant/cloudant")({
    url: params.__bx_creds.cloudantnosqldb.url,
    plugins: [
      { iamauth: { iamApiKey: params.__bx_creds.cloudantnosqldb.apikey } },
    ],
  });
  const db = cloudant.db.use("ecommerce");
  const query = {
    selector: {
      $and: [
        { _id: { $eq: params._id } },
        { collection: { $eq: "private-repo" } },
      ],
    },
  };

  const res = await db.find(query);
  const paypalQuery = {
    selector: {
      $and: [
        { github_username: { $eq: res.docs[0].username } },
        { collection: { $eq: "paypal" } },
      ],
    },
  };

  const paypalEmail = await db.find(paypalQuery);
  // if(paypalEmail.docs[0].github_username===res.docs[0].username) return {status:false,message:"you could only buy repo that is not yours"}
  let clientId = params.paypal_client_id;
  let clientSecret = params.paypal_client_secret;
  let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
  let client = new paypal.core.PayPalHttpClient(environment);
  let request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: res.docs[0].amount,
        },
        payee: {
          email_address: paypalEmail.docs[0].email,
        },
      },
    ],

    application_context: {
      return_url: `${params.return_url}/${params.token}/${params._id}/${random}`,
      cancel_url: params.cancel_url,
    },
  });

  let response = await client.execute(request);
  await db.insert({
    random,
    id: response.result.id,
    token: params.token,
    collection: "transaction",
  });
  return response;
};
const manage_access = async function (params) {
  const { __ow_path } = params;
  // return {headers:{"Content-Type":"application/json"},statusCode:200,body:{data:{__ow_path}}}
  const [pam, token, _id, random] = __ow_path.split("/");
  const { access_token } = jwt.verify(token, params.token_pass);
  const cloudant = require("@cloudant/cloudant")({
    url: params.__bx_creds.cloudantnosqldb.url,
    plugins: [
      { iamauth: { iamApiKey: params.__bx_creds.cloudantnosqldb.apikey } },
    ],
  });
  const db = cloudant.db.use("ecommerce");
  const query = {
    selector: {
      $and: [
        { access_token: { $eq: access_token } },
        { collection: { $eq: "user" } },
      ],
    },
  };

  const res = await db.find(query);

  if (res.docs.length === 1) {
    const transaction = await db.find({
      selector: {
        $and: [{ random }, { token }, { collection: "transaction" }],
      },
    });

    let clientId = params.paypal_client_id;
    let clientSecret = params.paypal_client_secret;
    let environment = new paypal.core.SandboxEnvironment(
      clientId,
      clientSecret
    );
    let client = new paypal.core.PayPalHttpClient(environment);
    const request = new paypal.orders.OrdersCaptureRequest(transaction.docs[0].id);
    request.requestBody({});
    let response = await client.execute(request);

    await db.destroy(transaction.docs[0]._id, transaction.docs[0]._rev);
    const queryPrivate = {
      selector: {
        $and: [{ _id: { $eq: _id } }, { collection: { $eq: "private-repo" } }],
      },
    };

    const privateRepo = await db.find(queryPrivate);

    const queryRepo = {
      selector: {
        $and: [
          { username: { $eq: privateRepo.docs[0].username } },
          { collection: { $eq: "user" } },
        ],
      },
    };

    const repoOwner = await db.find(queryRepo);
    const queryPaypal = {
      selector: {
        $and: [
          { github_username: { $eq: privateRepo.docs[0].username } },
          { collection: { $eq: "paypal" } },
        ],
      },
    };

    const paypalAcc = await db.find(queryPaypal);
    const { data, status } = await axios({
      url: `https://api.github.com/repos/${privateRepo.docs[0].username}/${privateRepo.docs[0].name}/collaborators/${res.docs[0].username}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `bearer ${repoOwner.docs[0].access_token}`,
      },
      data: {
        permission: "pull",
      },
      method: "PUT",
    });
    
    if (status === 201) {
      let paypal = paypalAcc.docs[0];
      let amount = Number(paypal.amount);
      amount += Number(privateRepo.docs[0].amount);
      paypal.amount = amount;
      await db.insert(paypal);
      const { _id:p, _rev:l, username, ...other } = privateRepo.docs[0];
      const selectOwnedRepo={selector:{
        ...other,
        owner_username: username,
        collection: "owned-repo",
        username: res.docs[0].username,
      }}
      const findOwnedRepo=await db.find(selectOwnedRepo)
const repoId=findOwnedRepo.docs.length>0?findOwnedRepo.docs[0]._id:undefined
const repoRev=findOwnedRepo.docs.length>0?findOwnedRepo.docs[0]._rev:undefined
      const ownedRepo = {
        _id:repoId,
        _rev:repoRev,
        ...other,
        owner_username: username,
        collection: "owned-repo",
        username: res.docs[0].username,
      };
      const { ok } = await db.insert(ownedRepo);
      if (ok) {
        return {
          headers: { location: `${params.frontend_url}/dashboard` },
          statusCode: 302,
        };
        
      } else {
        return {
          headers: { location: `${params.frontend_url}/error` },
          statusCode: 302,
        };
      
      }
    } else {
      
      return {
        headers: { location: `${params.frontend_url}/error` },
        statusCode: 302,
      };
    }
  }
};
module.exports.buy_paypal = buy_paypal;
module.exports.manage_access = manage_access;
```

This manage_access.js is used to tell the backend that if someone successfully pay the private repo amount it will automatically get access to it. After that deploy the function into the IBM Cloud functions using `serverless deploy` and voila our application is done.

# Conclusion

Finally you can create your own application now using IBM Cloud Object Storage for static web hosting, IBM Cloud Function as the backend logic, and IBM cloudant as the database, you can go forward and make your own application now. I hope you enjoy this tutorial if you have question just comment down below and i will try as much as i can to answer it





