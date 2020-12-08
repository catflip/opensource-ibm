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
  
    if (data && data.data.length>0) {
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
      return {username:res.docs[0].username,data:repo.docs}
            
    }else{
      return {status:false,data:[],message:"error token"}
    }
    
  }
  module.exports.sell_repo = sell_repo;
  module.exports.unlist_repo = unlist_repo;
  module.exports.for_sale_repo = for_sale_repo;