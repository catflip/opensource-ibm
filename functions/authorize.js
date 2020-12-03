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
    const { login } = await getUsername({ access_token });
    const {token} = await checkUsername({
      username: login,
      cloudant,
      access_token,
      token_pass: params.token_pass,
    });
    if(token){
      return  {
        headers: { location: `${params.frontend_url}/callback?token=${token}` },
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
    url: " https://api.github.com/user",
    headers: {
      Authorization: `token ${access_token}`,
      Accept: "application/vnd.github.v3+json",
    },
    method: "GET",
  });
  return data;
}
async function checkUsername({ username, access_token, cloudant, token_pass }) {
  const token = jwt.sign({ access_token }, token_pass);
  const db = cloudant.db.use("ecommerce");
  var query = {
    selector: {
      $and: [{ username: { $eq: username } }, { collection: { $eq: "user" } }],
    },
  };

  const res = await db.find(query);
  if (res.docs.length > 1) {
    const { _id, _rev } = res.docs;
    const user = {
      _id,
      _rev,
      username,
      access_token,
      token,
      collection: "user",
    };
    const {ok}= await db.insert(user);
     return ok && {token};
  } else {
    const user = { username, access_token, token, collection: "user" };
    const {ok}=await db.insert(user);
    return ok && {token};
    
  }
}
module.exports.github = github;
