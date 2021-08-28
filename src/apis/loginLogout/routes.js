'use strict';
const appRoot = require('app-root-path');
const login = require(`${appRoot}/src/apis/loginLogout/controllers/login`);
module.exports = function(){
    return [
        {
            method: 'POST',
            path: '/login/1',
            handler: login
        }
    ];
}();