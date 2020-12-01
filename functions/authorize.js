"use strict";
const axios = require("axios");
const formUrlEncoded = x =>
   Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '')
const github = async function (params) {
  
  // if (params.code) {
       
  //   const { data } =await axios({
  //     url: "https://github.com/login/oauth/access_token",
  //     headers: { 'Content-Type': 'application/x-www-form-urlencoded',"Accept": "application/json" },
  //     data: formUrlEncoded({
  //        client_id: params.github_client_id,
  //        client_secret: params.github_client_secret,
  //        code: params.code
  //     }),
  //     method:"POST"
  //   });
  //   return data;
    
  // } else {
  //   return { payload: "error please ask backend" };
  // }
  const cloudant = require('@cloudant/cloudant')({url:params.__bx_creds.cloudantnosqldb.url,plugins: [ { iamauth: { iamApiKey: params.__bx_creds.cloudantnosqldb.apikey }}] });
  const db = cloudant.db.use("ecommerce");

  // write a new document to the database
  const doc = {
    username: "spiritbro1"
  };
  return db.insert(doc);
};

module.exports.github = github;
