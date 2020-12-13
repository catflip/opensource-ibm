# Introduction
Today im gonna show you how to make an ecommerce website using IBM cloud. I wish after this tutorial you can make the same or much more beautiful ecommerce website using IBM Cloud only, because IBM cloud has so much feature that you need to run a beautiful ecommerce website. The ecommerce i want to create here is a marketplace of private repo of github. Why i want to create a marketplace for it? while github is an open source community. The reason of this is, because i really love open source and if you use github you already know all of this open source maintainer is really struggling with their life some of them is a really great developer and make a great open source contribution but rarely getting sponsored, by creating this ecommerce of collection of private repo i hope they have some kind of way to monetize their open source especially the open source that can't be open to the public because for example an exclusivity of it like in public repo it doesn't have face recognition feature but in private repo it has face recognition feature. So i hope you enjoy this tutorial let's get started.
# Prerequisites
To complete this tutorial you will need :
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
# Step 1 - Create A Bucket In IBM COS
Create a bucket using setting like this so that we can serve static website from our storage :
![bucket name](https://rino.world/api/convertimage?url=https://imgur.com/download/Rz5GQvW)
Name your bucket, pick Cross Region and ap-geo as location and use smart tier as storage class now we want also to use this as a static website so add rule on the static website rule like this :
![static webhost](https://rino.world/api/convertimage?url=https://imgur.com/download/G7k354V)
Save it and create bucket now we need to create service credential to upload much more easily using rclone if you haven't download rclone use [this](https://cloud.ibm.com/docs/cloud-object-storage?topic=cloud-object-storage-rclone) tutorial to get started, now after you create your bucket click on service credentials menu on the left hand side of your screen then create service credential like this :
![service credential](https://rino.world/api/convertimage?url=https://imgur.com/download/uyVpTEV)
Then you will get access key id and secret like this :
![access key](https://rino.world/api/convertimage?url=https://imgur.com/download/SBZAjCH)
copy paste that for the rclone config so that we can use rclone config to easily upload our frontend file later use this config:
{% gist https://gist.github.com/spiritbro1/164675ee6de116f4525bd1641b2ee1b5 %}
# Step 2 - Create A Frontend And Deploy It To IBM Cloud Object Storage
First of all let's create a simple frontend by using nuxt-typescript run this code in your terminal :
{% gist https://gist.github.com/spiritbro1/0ed5c4c41865ede608543e2ba666872b %}
Create your nuxt app using this setting :
{% gist https://gist.github.com/spiritbro1/f9d8ce22a2f498d969f259c4f4dc37c9 %}
Run the app using `yarn dev` if you see this screen, then you're successfully create the nuxt application :
![homepage](https://rino.world/api/convertimage?url=https://imgur.com/download/MldBOzB)
Now we need to create our frontend to suit our needs first let's remove all of the html in pages/index.vue so it will look like this in pages folder :
![delete indexvue](https://rino.world/api/convertimage?url=https://imgur.com/download/9FXTl6d)
Also remove all the component in components folder, and create Home.vue for our homepage like this :
![homepage](https://rino.world/api/convertimage?url=https://imgur.com/download/VbUqgsu)
Now we need to install nuxt-property-decorator, to make our component much more tidier install the package using this command :
{% gist https://gist.github.com/spiritbro1/85c2403487656851cb9814027d093372 %}
Now go to `components/Home.vue` and let's create our homepage, we are using vuetify here so we gonna use vuetify component as well to create our homepage so lets create our homepage like this :
{% gist https://gist.github.com/spiritbro1/704710412742ae06c9acf63406f18a5a %}
Now go to your `pages/index.vue` and import this
{% gist https://gist.github.com/spiritbro1/006a726f19814b7c36139bec048350f7 %}
After that go to `layouts/default.vue` and change the whole content like this :
{% gist https://gist.github.com/spiritbro1/02dcaa0cab50a5f583d53db54f76a7d0 %}
Go to the browser and go to `http://localhost:3000` and if its successful you will see something like this :
![homepage](https://rino.world/api/convertimage?url=https://imgur.com/download/kz6upKd)
Now let's upload it to IBM cloud storage using rclone :
{% gist https://gist.github.com/spiritbro1/be0f87a469162a3f19a9d8abb580fffd %}
Find your static website url under bucket configuration like this :
![configuration menu](https://rino.world/api/convertimage?url=https://imgur.com/download/ZBIUmv2)
![static website url](https://rino.world/api/convertimage?url=https://imgur.com/download/ud0eDp8)
Create public access for your static website like this on access policies menu :
![access policy](https://rino.world/api/convertimage?url=https://imgur.com/download/WX8JaCG)
Then open it up in browser like this :
![homepage preview](https://rino.world/api/convertimage?url=https://imgur.com/download/HXrfLp0)
# Step 3 - Create Login Page To Authorize User Github Account
After you create homepage let's create login page this login page is used for login to github and get the private repo create `pages/login.vue` and add this code :
{% gist https://gist.github.com/spiritbro1/679483b9fbaa94508e974d59f4d826b1 %}
We need to use fontawesome icon to make our login page more beautiful so download this using this command :
{% gist https://gist.github.com/spiritbro1/dad0820691f85ce2f260d3122bdab57e %}
Modify nuxt.config.js adding to the vuetify section.
{% gist https://gist.github.com/spiritbro1/83988475c7c15ac8d84671c00f9e9352 %}
Now create `components/Login.vue` and add this code :
{% gist https://gist.github.com/spiritbro1/1d44cce5c8a3d7d8bc425e6e60c2e390 %}
Go to `http://localhost:3000/login` and you will see your login page look something like this :
![login page](https://rino.world/api/convertimage?url=https://imgur.com/download/vGCiP6L)
Now we need to create github oauth apps so that our application can login throught github and get personal repo of a user if you haven't create one follow the instruction [here](https://docs.github.com/en/free-pro-team@latest/developers/apps/creating-a-github-app) pick oauth apps because we just need the oauth to get the user private repo :
![oauth apps](https://rino.world/api/convertimage?url=https://imgur.com/download/BMC7ZMf)
For the authorization url we gonna use IBM Cloud Function and IBM Cloudant NoSQL DB so that we can store the access token to be used later, so in order to do this install IBM Cli using this [instruction](https://cloud.ibm.com/docs/cli?topic=cli-install-ibmcloud-cli) if you have installed it login to your console and go to this [link](https://cloud.ibm.com/functions/cli) follow the instruction there and if there is an error like this :
![error region](https://rino.world/api/convertimage?url=https://imgur.com/download/2DaXF9w)
That means you haven't setup a region to determine which region you're based on go to the top of this [link](https://cloud.ibm.com/functions/cli) and you can find your region under namespace like this :
![region](https://rino.world/api/convertimage?url=https://imgur.com/download/JghjKpw)
You can find your region name by using command `ibmcloud regions` then after that set your region by using this command :
{% gist https://gist.github.com/spiritbro1/5e01afb6f61d4ba903dd55357cc459ad %}
Now we gonna install `serverless` cli to upload our function much more easier go ahead and run this command in your command line :
{% gist https://gist.github.com/spiritbro1/9fddf276982c3229fadbadcecca2acd0 %}
Now go to the root of your folder and type this command :
{% gist https://gist.github.com/spiritbro1/ce544022ce5e51f1961af96896bbb8dd %}
Now let's rename `handler.js` into `authorize.js` so that it's easier for us to remember that this function is for authorize github account before we create our function let's create cloudant db first if you haven't create one follow [this](https://cloud.ibm.com/docs/Cloudant) tutorial to get started don't forget to create credential for your cloudant db by clicking service credential menu on cloudant db dashboard :
![cloudant service account](https://rino.world/api/convertimage?url=https://imgur.com/download/Uohvb4j)
After that run this command to select group :
{% gist https://gist.github.com/spiritbro1/6d2a2b328ca4eb53e1ad6bc164cfcea6 %}
Then now in `functions` folder change the code of `serverless.yml` file into this :
{% gist https://gist.github.com/spiritbro1/b9f3d820ab0b87690eb9822f397a0e23 %}
Create a file called `.env` then add this line :
{% gist https://gist.github.com/spiritbro1/64e9048f71b53ba33a99bc8900dcd280 %}
Let's download the necessary dependencies first :
{% gist https://gist.github.com/spiritbro1/971200c47a6a85d6574545511c1b1440 %}
Now let's create function to authorize our user open `authorize.js` and change the code to this one :
{% gist https://gist.github.com/spiritbro1/d32bd67e60cea97b626a4e65c15a6b94 %}
After you done setting up IBM cloud functions run this command to deploy it :
{% gist https://gist.github.com/spiritbro1/d5e81b7322a54a28f4d37e03f62c1f6f %}
Copy the URL you got from `serverless deploy` for github authorization callback url :
![url](https://rino.world/api/convertimage?url=https://imgur.com/download/OFIQlGz)
![authorization callback](https://rino.world/api/convertimage?url=https://imgur.com/download/l1Bu4BI)
After you done let's go back to root folder then go to `frontend` folder download this dependencies to get environment variable from a file :
{% gist https://gist.github.com/spiritbro1/68c726477dc871c2f9e34df4a8893070 %}
Then in `nuxt.config.js` add this line :
{% gist https://gist.github.com/spiritbro1/a49516983951e80ba003c7a7eb941c51 %}
Add `.env` file in the `frontend` folder and add this line :
{% gist https://gist.github.com/spiritbro1/148398e186a2254817eb6c7caa4d2367 %}
After that go to `components/Login.vue` then change the button html to this one :
{% gist https://gist.github.com/spiritbro1/e8113618b86a50bda71d85cffc147af7 %}
And add script to `components/Login.vue` like this one :
{% gist https://gist.github.com/spiritbro1/e804b5d87be0874bf2e4e79e6259c56c %}
Now create file in `pages/callback.vue` to receive token and set it in cookies like this :
{% gist https://gist.github.com/spiritbro1/372093163c05081d372dbf51e3016f2d %}
And then change the script in `pages/index.vue` to implement if there is token in the cookies remove the login button in homepage and change it to Dashboard button and logout button
{% gist https://gist.github.com/spiritbro1/c5d9fd39d9fc162d5957052f568dff91 %}
After that change the `components/Home.vue` to implement button change like this :
{% gist https://gist.github.com/spiritbro1/409fb7e1329a6490426bd870bd955439 %}
And now generate the frontend just like before and rclone it :
{% gist https://gist.github.com/spiritbro1/a8f8c1d477e23fdf0d792b16eff04061 %}
Go to your browser and open your public static web hosting url try to login using your github account and if you see something like this below then your authorization is done and you are successfully deploy serverless auth using IBM cloud function and save the token in IBM cloudant :
![auth finish](https://rino.world/api/convertimage?url=https://imgur.com/download/uKcOTmq)
# Step 4 - Create Dashboard To Get Private Repo
First of all we need to change the `Home.vue` in `frontend` folder go to `components/Home.vue` and change the button so that it can go to dashboard and logout :
{% gist https://gist.github.com/spiritbro1/bd284fe7f57e5399b25c40825f7744f8 %}
Now let's create `pages/dashboard.vue` to handle our Dashboard.vue component
{% gist https://gist.github.com/spiritbro1/5130b8a92e021af47886cc181d8c83d3 %}
And if that finish now let's create `components/Dashboard.vue` to show balance and to show our private repo later
{% gist https://gist.github.com/spiritbro1/bd7b4b4233b26f100f5ca68f2972bfd7 %}
This is how our dashboard will look like for now :
![dashboard](https://rino.world/api/convertimage?url=https://imgur.com/download/mN3NjSY)
After that let's change the github oauth url to enable our api token to get our private repo go to `components/login.vue` then change the script into this :
{% gist https://gist.github.com/spiritbro1/369da28e389241aa78b93b1320159f64 %}
It will now show authorization url that will grant an access to our private and public repo, but since this is a private repo marketplace, then we gonna get private repo only, now go back to `functions` folder and create an IBM cloud function that can get our private repo,get profile,and get repo that we bought from other github user, create a file called `private_repo.js` and write this code :
{% gist https://gist.github.com/spiritbro1/0da725f97126b3ed2db9791642dd9925 %}
Change `serverless.yml` to suit our needs like this :
{% gist https://gist.github.com/spiritbro1/ed2a9f4d0c22888c74eba2dc5a51dcc1 %}
Now let's deploy it using `serverless` command line like this :
{% gist https://gist.github.com/spiritbro1/6c2deced446c8a65b9b43e52f7808c3d %}
Now let's change our Dashboard.vue so that it can show our private repo :
{% gist https://gist.github.com/spiritbro1/eecfba86c3ed88ab36e94ef058bbc839 %}
Also create `components/dashboard_components/DashboardRepo.vue` component to show our private repo and owned repo :
{% gist https://gist.github.com/spiritbro1/9a409e4bf7edb054ff39adc0c565a1e6 %}
Create `components/dashboard_components/DashboardInfo.vue` component to show username, profile picture and balance :
{% gist https://gist.github.com/spiritbro1/d105544c5de4f3f8dbdc3d548c3e860c %}
Go to `http://localhost:3000/dashboard` and you will see something like this if you're successfully shown your private repo :
![dashboard](https://rino.world/api/convertimage?url=https://imgur.com/download/kqDH9Q9)
# Step 5 - Create Function That Can Sell And Buy Repo
Create a file called `sell_repo.js` on `functions` folder we gonna use this file to inform the application that our repo is for sale,unlist repo for sale, and sell repo:
{% gist https://gist.github.com/spiritbro1/ccc5a02003194fa98a6b7ba2821ecbf2 %}
Now let's change our `components/Dashboard.vue` to implement our cloud function like this :
{% gist https://gist.github.com/spiritbro1/119461127481c5ddb9576c5950be0682 %}
Also change the `components/dashboard_components/DashboardRepo.vue` so that it can show the list of private repo after clicking sell button :
{% gist https://gist.github.com/spiritbro1/95f5f6acb530ba27496d0d581a1b1f95 %}
Now go to `Home.vue` so that we can show our for sale repo after clicking it :
{% gist https://gist.github.com/spiritbro1/535cdd1dba6ba8565a11b08ea609ff8a %}
Now you can sell your repo when you put the amount and clicking sell button like this :
![sell](https://rino.world/api/convertimage?url=https://imgur.com/download/txjAAUk)
Then when you go to homepage it also shown the price and buy button :
![buy shop](https://rino.world/api/convertimage?url=https://imgur.com/download/PzKIZ86)
# Step 6 - Integrate Paypal To Accept Payment
First create sandbox paypal account [here](https://developer.paypal.com/developer/accounts/), after that create a demo account on developer account :
![demo account](https://rino.world/api/convertimage?url=https://imgur.com/download/AUne0sZ)
Then let's change our balance UI into a button that can accept paypal payment go to `frontend` folder and go to `components/dashboard_components/DashboardInfo.vue` and change the balance UI like this :
{% gist https://gist.github.com/spiritbro1/00082821062d178925ec2a808b35dfdd %}
Also in the `components/Home.vue` add this code :
{% gist https://gist.github.com/spiritbro1/f1abce24d849a1da7332f6ed3f74abde %}
it will now look like this :
![home.vue](https://rino.world/api/convertimage?url=https://imgur.com/download/JSkOxW4)
Now we need to add function to make that button connect to our paypal so that we can see our balance in return, also we will make a condition so that when the paypal connected, we can sell the repo, but when it doesn't connect, it can't sell the repo go ahead and change `frontend/components/dashboard_components/DashboardRepo.vue` to this :
{% gist https://gist.github.com/spiritbro1/d11768d99570bf0a4cab96e9c1e1043b %}
Now whenever the paypal button not connected the sell button is disabled
![disabled](https://rino.world/api/convertimage?url=https://imgur.com/download/AJ1HaZy)
Let's now create a function that can send money through paypal when buying one of the repo,now create a read access to that repo,now go to `functions` folder and create `manage_access.js`
{% gist https://gist.github.com/spiritbro1/f27a5ce0805ca4e02b329ef0e30d5051 %}
This manage_access.js is used to tell the backend that if someone successfully pay the private repo amount it will automatically get access to it. After that deploy the function into the IBM Cloud functions using `serverless deploy` and voila our application is done.
# Conclusion
Finally you can create your own application now using IBM Cloud Object Storage for static web hosting, IBM Cloud Function as the backend logic, and IBM cloudant as the database, you can go forward and make your own application now. I hope you enjoy this tutorial if you have question just comment down below and i will try as much as i can to answer it