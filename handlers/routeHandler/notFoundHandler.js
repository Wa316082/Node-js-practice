/*
*Title: not found Handlers
*Descriptions: not found route all methods here
*/


//modules cuffholdings

const handler ={}

handler.notFoundHandler =(requestProperties, callback)=>{
    callback(404, {
        message: 'Your Url not found'
    });
}

module.exports= handler;