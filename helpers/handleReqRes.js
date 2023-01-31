/*
 *Title: Handle Request and Response
 *Description: Handle Request And Response
 */

//  dependensis sections 
const url = require("url");
const { StringDecoder } = require("string_decoder");
const routes = require('../router/router');
const {notFoundHandler} = require('../handlers/routeHandler/notFoundHandler');
const {parseJSON} =require('../helpers/utilities')

 //module scaffholding
 const handler={};
 handler.handleReqRes =(req, res) => {
    // request handle
    // get the url parse it
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, "");
    const method = req.method.toLowerCase();
    const queryStringObject = parsedUrl.query;
    const headerObject = req.headers;
    const requestProperties = {
        parsedUrl,
        path,
        method,
        queryStringObject,
        headerObject,
        trimmedPath,

    };
    
    const decoder = new StringDecoder("utf-8");
    let realData = "";
    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;
    
    
    
    req.on("data", (buffer) => {
      realData += decoder.write(buffer);
    });
  
    req.on("end", () => {
      realData += decoder.end();
      requestProperties.body = parseJSON(realData);
      chosenHandler(requestProperties , (statusCode , payLoad)=>{
        statusCode = typeof(statusCode) === 'number' ? statusCode : 500;
        payLoad = typeof(payLoad) === 'object' ? payLoad :{};

        const payloadString = JSON.stringify(payLoad);

        //return the final response

        res.setHeader('Contemnt-type', 'application/json');
        res.writeHead(statusCode);
        res.end(payloadString);
    });
    });
    
  };

  module.exports = handler;