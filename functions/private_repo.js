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
