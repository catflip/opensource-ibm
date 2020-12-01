'use strict';

function github(params) {
  return { payload: `The time in ${JSON.stringify(params.__bx_creds)}` };
}

module.exports.github = github;
const main = function(params) { 

  // configure the @cloudant/cloudant library
  // const opts = {url: args.url, plugins: ['cookieauth', 'promises']};
  const cloudant = require('@cloudant/cloudant')({url:params.__bx_creds.cloudantnosqldb.url,plugins: [ { iamauth: { iamApiKey: params.__bx_creds.cloudantnosqldb.apikey }}] });  
  const db = cloudant.db.use("ecommerce");
  
  // write a new document to the database
  const doc = {
    timestamp: new Date().getTime(),
    num: Math.random()
  };
  return db.insert(doc);
};

module.exports.main = main;