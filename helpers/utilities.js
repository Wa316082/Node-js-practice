/*
 *Title: Utilities
 *Description: Handle All Utilities related work
 */

//dependencies
const crypto = require('crypto');
const env = require('./env')
 //module scaffolding

 const utilities ={};

 //parse JSON string Data
 utilities.parseJSON = (jsonString)=>{
    let output;

    try {
        output = JSON.parse(jsonString);
    } catch  {
        output = {};
    }

    return output;

 }


 //Hass the string Data
 utilities.hash = (str)=>{
    if(typeof(str) === 'string' && str.length >= 6){
        let hash = crypto.createHmac('sha256', env.secretKey)
        .update(str)
        .digest('hex');
        return hash;
    } 

    return false;

 }

 module.exports =utilities;
