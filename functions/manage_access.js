"use strict";
const axios = require("axios");
const jwt = require("jsonwebtoken");
const formUrlEncoded = (x) =>
  Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, "");
const paypal = require("@paypal/checkout-server-sdk");
const buy_paypal = async function (params) {
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
  if(paypalEmail.docs[0].username===res.docs[0].username) return {status:false,message:"you could only buy repo that is not yours"}
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
      return_url: params.return_url,
      cancel_url: params.cancel_url,
    },
  });

  let response = await client.execute(request);
  return response
  
};

module.exports.buy_paypal = buy_paypal;

