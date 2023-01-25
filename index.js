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
//app object - modules scaffolding
const app = {};

//configuration
app.config = {
  port: 3000,
};

//create server

app.createServer = () => {
  const server = http.createServer(app.handleRequest);
  server.listen(app.config.port, () => {
    console.log(`listening to port ${app.config.port}`);
  });
};

//handle Request and Response
app.handleRequest = handleReqRes

// start server

app.createServer();
