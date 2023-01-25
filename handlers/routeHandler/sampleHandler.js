/*
*Title: Sample Handlers
*Descriptions: Sample route all methods here
*/


//modules cuffholdings

const handler ={}

handler.sampleHandler =(requestProperties , callback)=>{
    console.log(requestProperties);
    callback(200, {
        message: 'This is a sample url'
    });
}

module.exports= handler;