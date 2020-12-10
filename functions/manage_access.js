"use strict";
const axios = require("axios");
const jwt = require("jsonwebtoken");
function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
const formUrlEncoded = (x) =>
  Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, "");
const paypal = require("@paypal/checkout-server-sdk");
const buy_paypal = async function (params) {
  const random=makeid(5);
  const cloudant = require("@cloudant/cloudant")({
    url: params.__bx_creds.cloudantnosqldb.url,
    plugins: [
      { iamauth: { iamApiKey: params.__bx_creds.cloudantnosqldb.apikey } },
    ],
  });
  const db = cloudant.db.use("ecommerce");
  const query = {
    selector: {
      $and: [{ _id: { $eq: params._id } }, { collection: { $eq: "private-repo" } }],
    },
  };

  const res = await db.find(query);
  const paypalQuery = {
    selector: {
      $and: [{ github_username: { $eq: res.docs[0].username } }, { collection: { $eq: "paypal" } }],
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
          email_address: paypalEmail.docs[0].email
        }
      },
      
    ],

    application_context: {
      return_url: `${params.return_url}/${params.token}/${params._id}/${random}`,
      cancel_url: params.cancel_url,
    },
  });

  let response = await client.execute(request);
  await db.insert({random,id:response.result.id,token:params.token,collection:"transaction"})
  return response
  
};
const manage_access = async function (params) {
  
  const {__ow_path}=params;
  const [pam,token,_id,random]=__ow_path.split("/")
  // return {statusCode:200,body:JSON.stringify(__ow_path.split("/"))}
  const {access_token} = jwt.verify(token , params.token_pass);
  const cloudant = require("@cloudant/cloudant")({
    url: params.__bx_creds.cloudantnosqldb.url,
    plugins: [
      { iamauth: { iamApiKey: params.__bx_creds.cloudantnosqldb.apikey } },
    ],
  });
  const db = cloudant.db.use("ecommerce");
  const query = {
    selector: {
      $and: [{ access_token: { $eq: access_token } }, { collection: { $eq: "user" } }],
    },
  };

  const res = await db.find(query);
if(res.docs.length===1){
  const transaction=await db.find({selector:{$and:[{random},{token},{collection:"transaction"}]}})
  let clientId = params.paypal_client_id;
  let clientSecret = params.paypal_client_secret;
  let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
  let client = new paypal.core.PayPalHttpClient(environment);
  request = new paypal.orders.OrdersCaptureRequest(transaction.docs[0].id);
  request.requestBody({});
  // Call API with your client and get a response for your call
  let response = await client.execute(request);
  await db.destroy({_id:transaction.docs[0]._id,_rev:transaction.docs[0]._rev})
  const queryPrivate = {
    selector: {
      $and: [{ _id: { $eq: _id } }, { collection: { $eq: "private-repo" } }],
    },
  };

  const privateRepo = await db.find(queryPrivate);
  const queryRepo = {
    selector: {
      $and: [{ username: { $eq: privateRepo.docs[0].username } }, { collection: { $eq: "user" } }],
    },
  };

  const repoOwner = await db.find(queryRepo);
  const queryPaypal = {
    selector: {
      $and: [{ github_username: { $eq: privateRepo.docs[0].username } }, { collection: { $eq: "paypal" } }],
    },
  };

  const paypalAcc = await db.find(queryPaypal);
  const {data,status} = await axios({
    url: `https://api.github.com/repos/${privateRepo.docs[0].username}/${privateRepo.docs[0].name}/collaborators/${res.docs[0].username}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `bearer ${repoOwner.docs[0].access_token}`,
    },
    data: {
      permission: "pull"
    },
    method: "PUT",
  });
  if(status===201){
    let paypal=paypalAcc.docs[0]
    paypal.amount+=privateRepo.docs[0].amount
    await db.insert(paypal)
    const {_id,_rev,username,...other}=privateRepo.docs[0];
    const ownedRepo={...other,owner_username:username,collection:"owned-repo",username:res.docs[0].username}
    const {ok}= await db.insert(ownedRepo);
    if(ok){
      return  {
        headers: { location: `${params.frontend_url}/dashboard` },
        statusCode: 302
        };
    }else{
      return  {
        headers: { location: `${params.frontend_url}/error` },
        statusCode: 302
        };
    }
    
  }else{
    return  {
      headers: { location: `${params.frontend_url}/error` },
      statusCode: 302
      };
  }
}
  
};
module.exports.buy_paypal = buy_paypal;
module.exports.manage_access = manage_access;

