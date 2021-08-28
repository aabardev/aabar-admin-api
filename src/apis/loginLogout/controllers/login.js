"use strict";
const appRoot = require('app-root-path');
verifyGoogleToken, getUserDetails
// const authService = require(appRoot +'/imerit/services/auth/authService');
// const Joi = require('joi');
// const createToken = require(appRoot+'/imerit/utility/token');

module.exports = (request, h) => {

    console.log("==============================");

    // return h.response({message : "success"});

    const schema = Joi.object().keys({
        email:Joi.string().required(),
        token: Joi.string().required(),
        reLogin:Joi.boolean().optional()
    });

    const {error, result} = schema.validate(request.payload);

    if(!error){
        return verifyGoogleToken(request.payload.token).then(resp=>{

            if(request.payload.email === resp.result){
                return getUserDetails(resp.result);
            }else{
                return Promise.reject({appcode:50005,message:"Failure: User doesn't match"})
            }
        }).then(userResp=>{
            
        }).catch(error=>{
            return h.response(error);
        });
    }else{
        let data = { appcode: 50006,  message: error.details[0].message.replace(new RegExp('"', "g"), '') };
        return h.response(data);
    }
};