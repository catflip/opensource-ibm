"use strict";
const axios = require("axios");
const jwt = require("jsonwebtoken");
const formUrlEncoded = (x) =>
  Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, "");
const authorize_paypal = async function (params) {
   if (params.code) {
    const { access_token } = await authenticate({ params });
    const { emails } = await getEmail({ access_token });
    

    if (emails) {
      return {
        headers: { location: `${params.frontend_url}/callback?state=paypal&email=${emails[0].value}` },
        statusCode: 302,
      };
    } else {
      return {
        headers: { location: `${params.frontend_url}/dashboard` },
        statusCode: 302,
      };
    }
  } else {
    return {
      headers: { location: `${params.frontend_url}/login` },
      statusCode: 302,
    };
  }
};

async function authenticate({ params }) {
  const { data } = await axios({
    url: "https://api.sandbox.paypal.com/v1/oauth2/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${params.paypal_client_id}:${params.paypal_client_secret}`
      ).toString("base64")}`,
    },
    data: formUrlEncoded({
      grant_type: "authorization_code",
      code: params.code,
    }),
    method: "POST",
  });
  return data;
}
async function getEmail({ access_token }) {
  const { data } = await axios({
    url:
      "https://api.sandbox.paypal.com/v1/identity/oauth2/userinfo?schema=paypalv1.1",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    method: "GET",
  });
  return data;
}
const save_paypal=async function(params){
  const cloudant = require("@cloudant/cloudant")({
    url: params.__bx_creds.cloudantnosqldb.url,
    plugins: [
      { iamauth: { iamApiKey: params.__bx_creds.cloudantnosqldb.apikey } },
    ],
  });
  const ok=await saveEmail({cloudant,token_pass:params.token_pass,token:params.token,email:params.email})
  if(ok){
    return {status:true,message:"email saved"}
  }else{
    return {status:false,message:"email not saved"}
  }
}
async function saveEmail({ token_pass,token, cloudant, email }) {
  const db = cloudant.db.use("ecommerce");
  const { access_token } = jwt.verify(token, token_pass);
  var query = {
    selector: { $and:[{access_token: { $eq: access_token } },{collection:{$eq:"user"}}]},
    fields: ["access_token", "username"],
  };

  const res = await db.find(query);
  if (res.docs.length === 1) {
    let paypal = await db.find({
      selector: {
        collection:{$eq:"paypal"},
        github_username:res.docs[0].username
      },
    });
    if(paypal.docs.length===1){
      const { _id, _rev,amount } = paypal.docs[0];
      const user = {
        _id,
        _rev,
        github_username:res.docs[0].username,
        email,
        amount,
        collection: "paypal",
      };
  
      const { ok } = await db.insert(user);
      return ok ;
    }else{
      const user = { github_username:res.docs[0].username, email,  collection: "paypal",amount:0 };
      const { ok } = await db.insert(user);
      return ok ;
    }
    
  } else {
    return false
  }
}
const get_paypal=async function(params){
  const cloudant = require("@cloudant/cloudant")({
    url: params.__bx_creds.cloudantnosqldb.url,
    plugins: [
      { iamauth: { iamApiKey: params.__bx_creds.cloudantnosqldb.apikey } },
    ],
  });
  const ok=await getPaypal({cloudant,token_pass:params.token_pass,token:params.token})
  if(ok){
    return {status:true,data:ok}
  }else{
    return {status:false,message:"error"}
  }
}
async function getPaypal({ cloudant, token_pass, token }) {
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
    return paypal.docs[0]
          
  }else{
    return {status:false,data:[],message:"error token"}
  }
  
}
const disconnect_paypal=async function(params){
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
