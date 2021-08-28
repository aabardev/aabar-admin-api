const axios = require('axios');

/**
 * It would call an external API in POST method 
 * @param {String} url, API URL path
 * @param {Object} postData , request payload data
 * @returns 
 */
 const verifyGoogleToken = (token)=>{
        
    return axios.get('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token='+token).then(response=>{

        if(response && response.data && response.data.email){

            axios.get('https://accounts.google.com/o/oauth2/revoke?token='+token);

            resolve({appcode:50003, message:"Google authenticate user", result : response.data.email});

        }else{
            reject({appcode:50005, message:"Failure: Google Verification failed"})
        }
    }).catch(err=>{
        console.log('Unable to verify user!' + err);
        reject({appcode:50003, message:'Error: - Unable to verify user!' + err});
    });
}

module.exports = {
    verifyGoogleToken
};