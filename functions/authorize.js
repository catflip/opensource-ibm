'use strict';
const axios=require("axios")
export default function github(params) {
  const name = params.code || 'World';
  return { payload: `Hello, ${name}!` };
}


