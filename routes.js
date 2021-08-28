'use strict';
const appRoot = require('app-root-path');
const loginLogout = require(`${appRoot}/src/apis/loginLogout/routes`);
module.exports = [
    ...loginLogout
]