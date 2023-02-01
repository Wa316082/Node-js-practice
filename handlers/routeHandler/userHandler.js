/*
 *Title: User Handlers
 *Descriptions: User route all methods here
 */

//dependencies
const data = require("../../lib/data");
const { hash } = require("../../helpers/utilities");
const { parseJSON } = require("../../helpers/utilities");
const tokenHandler = require("../routeHandler/tokenHandler");
//modules cuffholdings

const handler = {};

handler.userHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._users[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._users = {};

// post method for user create
handler._users.post = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;
  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;
  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length >= 6
      ? requestProperties.body.password
      : false;
  const agreements =
    typeof requestProperties.body.agreements === "boolean"
      ? requestProperties.body.agreements
      : false;
  if (firstName && lastName && phone && agreements && password) {
    // make sure that ther user does not exist already
    data.read("users", phone, (err) => {
      if (err) {
        // do the job
        let userObject = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          agreements,
        };

        //store the user to database

        data.create("users", phone, userObject, (err) => {
          if (!err) {
            callback(200, {
              message: "User created successfully",
            });
          } else {
            callback(500, {
              error: err,
            });
          }
        });
      } else {
        callback(500, {
          error: "User already Exist on this phone number",
        });
      }
    });
  } else {
    callback(400, {
      error: "You have a problem in your request",
    });
  }
};

//get method for get user
handler._users.get = (requestProperties, callback) => {
  //check the phone number is exist
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;
  if (phone) {
    //verify token
    let token =
      typeof requestProperties.headerObject.token === "string"
        ? requestProperties.headerObject.token
        : false;

    tokenHandler._token.verify(token, phone, (tokenId) => {
      if (tokenId) {
        //get the user
        data.read("users", phone, (err, res) => {
          const user = { ...parseJSON(res) };
          if (!err && user) {
            delete user.password;

            callback(200, user);
          } else {
            callback(404, {
              error: "User not found",
            });
          }
        });
      } else {
        callback(401, {
          error: "Unauthenticated",
        });
      }
    });
  } else {
    callback(404, {
      error: "UIser not foumnd",
    });
  }
};

//put mehod for user data update
handler._users.put = (requestProperties, callback) => {
  //Check ther is exist or not
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;
  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;
  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 6
      ? requestProperties.body.password
      : false;

  if (phone) {
    if (firstName || lastName || password) {
      let token =
        typeof requestProperties.headerObject.token === "string"
          ? requestProperties.headerObject.token
          : false;

      tokenHandler._token.verify(token, phone, (tokenId) => {
        if (tokenId) {
          //find the user

          data.read("users", phone, (err, res) => {
            const userData = { ...parseJSON(res) };

            if (!err && res) {
              if (firstName) {
                userData.firstName = firstName;
              }
              if (lastName) {
                userData.lastName = lastName;
              }
              if (password) {
                userData.password = hash(password);
              }
              // updatre user
              data.update("users", phone, userData, (err) => {
                if (!err) {
                  callback(200, {
                    message: "User updated successfully",
                  });
                } else {
                  callback(500, {
                    error: "There was a problem in server side",
                  });
                }
              });
            } else {
              callback(400, {
                error: "You have a problem in your request",
              });
            }
          });
        } else {
          callback(401, {
            error: "Unauthenticated",
          });
        }
      });
    } else {
      callback(400, {
        error: "You have a problem in your request",
      });
    }
  } else {
    callback(400, {
      error: "Invalid user phone number check and try again",
    });
  }
};

//Delete function for user delete
handler._users.delete = (requestProperties, callback) => {
  //check the phone number is exist
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;
  if (phone) {
    //verify token
    let token =
      typeof requestProperties.headerObject.token === "string"
        ? requestProperties.headerObject.token
        : false;

    tokenHandler._token.verify(token, phone, (tokenId) => {
      if (tokenId) {
        data.read("users", phone, (err, res) => {
          if (!err && res) {
            data.delete("users", phone, (err) => {
              if (!err) {
                callback(200, {
                  message: "User successfuly deleted",
                });
              } else {
                callback(500, {
                  error: "There was a server side problem",
                });
              }
            });
          } else {
            callback(500, {
              error: "There war sa problem in server side",
            });
          }
        });
      } else {
        callback(401, {
          error: "Unauthenticated",
        });
      }
    });
  } else {
    callback(400, {
      error: "There is problem in your request",
    });
  }
};

module.exports = handler;
