/*
*Title: Routes
*Descriptions: Applications all routes
*/

//dependensis sections

const {sampleHandler} = require('../handlers/routeHandler/sampleHandler');


const routes ={
    sample : sampleHandler,
}

module.exports = routes;