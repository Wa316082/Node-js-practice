/*
*Title: token Handlers
*Descriptions: token route all methods and token create  here
*/

//Dependencies
const data = require('../../lib/data');
const {hash, createToken, parseJSON} = require('../../helpers/utilities');

//modules cuffholdings

const handler ={}

handler.tokenHandler =(requestProperties , callback)=>{
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if(acceptedMethods.indexOf(requestProperties.method)> -1){
        handler._token[requestProperties.method](requestProperties, callback);
    }else{
        callback(405);
    }
}

 handler._token = {};

 handler._token.get = (requestProperties, callback)=>{
    //check the phone number is exist 
    const id = typeof requestProperties.queryStringObject.id === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id :false;
    if(id){
        //get the token
        data.read('tokens', id, (err, res)=>{
            const token = {...parseJSON(res)};
            if(!err && token){
                callback(200, token);
            }else{
                callback(404, {
                    error: 'User not found',
                });
            }
        });

    }else{
        callback(404,{
            error : 'User not foumnd',
        })
    }
 }

 handler._token.post = (requestProperties, callback)=>{
    const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length >= 6 ? requestProperties.body.password : false;
    const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

    if(phone && password){
        data.read('users', phone, (err, res)=>{
            if(!err && res){
                let hashedPassword = hash(password);
                if(hashedPassword === parseJSON(res).password){
                    let tokenId = createToken(20);
                    let expires = Date.now()+60*60*1000;
                    let tokenObject = {
                        phone,
                        'id':tokenId,
                        expires,
                    }
                    data.create('tokens', tokenId, tokenObject, (err)=>{
                        if(!err){
                            callback(200, tokenObject );
                        }else{
                            callback(500,{
                                error: 'Tere was a problem in server side'
                            });
                        }
                    });
                }else{
                    callback(400, {
                        error: 'Password invalid'
                    });
                }
            }else{
                callback(400, {
                    error: 'You have a problem in your request'
                });
            }
        });
    }else{
        callback(400, {
            error: 'You have a problem in your request'
        });
    }
 }

 handler._token.put = (requestProperties, callback)=>{
    const id = typeof requestProperties.body.id === 'string' && requestProperties.body.id.trim().length === 20 ? requestProperties.body.id : false;
    const extend = typeof requestProperties.body.extend === 'boolean' && requestProperties.body.extend === true ? true : false;
    if(id && extend){
        data.read('tokens', id, (err, res)=>{
            if(!err && res){
                let tokenObject = parseJSON(res);
                if(tokenObject.expires > Date.now()){
                    tokenObject.expires = Date.now() +60*60*1000;
                    data.update('tokens', id, tokenObject, (err)=>{
                        if(!err){
                            callback(200, {
                                message: 'token updated'
                            } );
                        }else{
                            callback(500, {
                                error: 'There was a problem in server side'
                            });
                        }
                    });
                }else{
                    callback(400,{
                        error: 'Token already expired',
                    });
                }
            }else{
                callback(400, {
                    error: err,
                });
            }
        });

    }else{
        callback(400, {
            error: 'Ther was a problem in your request'
        });
    }
 }

 handler._token.delete = (requestProperties, callback)=>{
    const id = typeof requestProperties.queryStringObject.id === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id :false;
    if(id){
        data.read('tokens',id, (err, res)=>{
            if(!err && res){
                data.delete('tokens', id, (err)=>{
                    if(!err){
                        callback(200, {
                            message: 'Token successfuly deleted',
                        });
                    }else{
                        callback(500, {
                            error: 'There was a server side problem',
                        });
                    }
                })
            }else{
                callback(500, {
                    error:'There war sa problem in server side',
                });
            }
        });
    }else{
        callback(400, {
            error: 'There is problem in your request'
        });
    }
 }


 //token verify function
 handler._token.verify = (id, phone, callback)=>{
    data.read('tokens', id, (err , res)=>{
        if(!err && res){
            if(parseJSON(res).phone === phone && parseJSON(res).expires > Date.now()) {
                callback(true);
            }else{
                callback(false);
            }

        }else{
            callback(false)
        }
    });
 }
module.exports= handler;