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