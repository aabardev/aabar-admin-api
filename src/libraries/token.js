'use strict';

const jwt = require('jsonwebtoken');
const appRoot = require('app-root-path');
const secret = require(appRoot+'/config/secret');

function createToken(user){
  let scopes;
  let userData = user;
  if(user.admin){
    userData.scope = 'admin';
  }
  // signin with jwt
  
  return jwt.sign(userData,secret,{algorithm:'HS256',expiresIn:'10h'});
  //return jwt.sign(userData,secret,{algorithm:'HS256',expiresIn:'20000'});
}

module.exports = createToken;
