"use strict";
const axios = require("axios");
const jwt = require("jsonwebtoken");
const formUrlEncoded = (x) =>
  Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, "");
const privateRepo = async function (params) {
  const cloudant = require("@cloudant/cloudant")({
    url: params.__bx_creds.cloudantnosqldb.url,
    plugins: [
      { iamauth: { iamApiKey: params.__bx_creds.cloudantnosqldb.apikey } },
    ],
  });
  if (params.code) {
    const { access_token } = await authenticate({ params });
    const { login } = await getUsername({ access_token });
    const { token } = await checkUsername({
      username: login,
      cloudant,
      access_token,
      token_pass: params.token_pass,
    });
    if (token) {
      return {
        headers: { location: `${params.frontend_url}/callback?token=${token}` },
        statusCode: 302,
      };
    } else {
      return {
        headers: { location: params.frontend_url },
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
module.exports.privateRepo = privateRepo;
async function getProfile({  cloudant, token_pass,token }) {
    const {access_token} = jwt.verify( token , token_pass);
    const db = cloudant.db.use("ecommerce");
  var query = {
    selector: { access_token: { $eq: access_token }}   
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
async function getPrivateRepo() {}
async function getOwnedPrivateRepo() {}
