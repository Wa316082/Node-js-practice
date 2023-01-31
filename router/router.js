/*
*Title: Routes
*Descriptions: Applications all routes
*/

//dependensis sections

const {sampleHandler} = require('../handlers/routeHandler/sampleHandler');
const {userHandler} = require('../handlers/routeHandler/userHandler');


const routes ={
    sample : sampleHandler,
    user : userHandler,
}

module.exports = routes;