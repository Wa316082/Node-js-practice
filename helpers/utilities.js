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

  //Token generate for authentications
  utilities.createToken = (stringLength)=>{
     

    let length = stringLength;
    length = typeof(stringLength) === 'number' && stringLength >10 ?stringLength : false;
    if(length){
        let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz1234567890@#$%^&*';
        let output = '';

        for(let i = 1; i<= length; i++){
           let  randomCharacter = possibleCharacters.charAt(Math.floor(Math.random()*possibleCharacters.length));
            output += randomCharacter;
        }
        return output;
    }else{
        return false;
    }
 }

 module.exports =utilities;
