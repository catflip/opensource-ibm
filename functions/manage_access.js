"use strict";
const axios = require("axios");
const jwt = require("jsonwebtoken");
const formUrlEncoded = (x) =>
  Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, "");

const disconnect_paypal=async function(params){
  const paypal = require('@paypal/checkout-server-sdk');
  
// Creating an environment
let clientId = "<<PAYPAL-CLIENT-ID>>";
let clientSecret = "<<PAYPAL-CLIENT-SECRET>>";
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);
 
// Construct a request object and set desired parameters
// Here, OrdersCreateRequest() creates a POST request to /v2/checkout/orders
let request = new paypal.orders.OrdersCreateRequest();
request.requestBody({
                          "intent": "CAPTURE",
                          "purchase_units": [
                              {
                                  "amount": {
                                      "currency_code": "USD",
                                      "value": "100.00"
                                  }
                              }
                           ]
                    });
 
// Call API with your client and get a response for your call
let createOrder  = async function(){
        let response = await client.execute(request);
        console.log(`Response: ${JSON.stringify(response)}`);
        // If call returns body in response, you can get the deserialized version from the result attribute of the response.
       console.log(`Order: ${JSON.stringify(response.result)}`);
}
createOrder();
  const cloudant = require("@cloudant/cloudant")({
    url: params.__bx_creds.cloudantnosqldb.url,
    plugins: [
      { iamauth: { iamApiKey: params.__bx_creds.cloudantnosqldb.apikey } },
    ],
  });
  const ok=await deletePaypal({cloudant,token_pass:params.token_pass,token:params.token})
  if(ok){
    return {status:true,data:ok}
  }else{
    return {status:false,message:"error"}
  }
}
async function deletePaypal({ cloudant, token_pass, token }) {
  const { access_token } = jwt.verify(token, token_pass);
  const db = cloudant.db.use("ecommerce");
  var query = {
    selector: { $and:[{access_token: { $eq: access_token } },{collection:{$eq:"user"}}]},
    fields: ["access_token", "username"],
  };

  const res = await db.find(query);
  if(res.docs.length===1){
    let paypal = await db.find({
      selector: {
        collection:{$eq:"paypal"},
        github_username:res.docs[0].username
      },
    });
    await db.destroy(paypal.docs[0]._id, paypal.docs[0]._rev)
    return {status:true,message:"success"}
          
  }else{
    return {status:false,data:[],message:"error token"}
  }
  
}
module.exports.authorize_paypal = authorize_paypal;
module.exports.save_paypal = save_paypal;
module.exports.get_paypal = get_paypal;
module.exports.disconnect_paypal = disconnect_paypal;
