/*  
    Title: Uptime Monitoring Application
    Description: A Restful API to motnitor up and down time of user created links
    Author: Wasim Akram
    Date:21/01/23
 */

// dependencies
const { setServers } = require("dns/promises");
const http = require("http");
const {handleReqRes} = require('./helpers/handleReqRes')
const env = require('./helpers/env');
const data = require('./lib/data');

//app object - modules scaffolding
const app = {};

// data.delete('test','newfile',  (err)=>{
//   console.log(err);
// });


//create server

app.createServer = () => {
  const server = http.createServer(app.handleRequest);
  server.listen(env.port, () => {
    console.log(`listening to port ${env.port}`);
  });
};

//handle Request and Response
app.handleRequest = handleReqRes

// start server

app.createServer();
