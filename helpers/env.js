/*
 *Title: Environment
 *Description: Handle All environment related work
 */

//Dependencies

//module scapholding
const env = {};

env.staging = {
  port: 3000,
  envName: "staging",
  secretKey: 'wasimak',
};

env.productionm = {
  port: 8000,
  envName: "Production",
  secretKey: 'wasimakram',
};

//determine which environment was passed
const currentEnv =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

//Export coresponding env object

const envToExport = typeof env[currentEnv] === 'object' ? env[currentEnv] : env.staging


module.exports = envToExport;