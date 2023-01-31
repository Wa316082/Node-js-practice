/*
 *Title: Data process
 *Description: Data read and write all proccess
 *Author: Wasim Akram
 *Date:21/01/23
 */

// Dependecies
const fs = require("fs");
const path = require("path");

//scaffholding
const lib = {};

//base directory of the data folder
lib.basedir = path.join(__dirname, "../.data/");

//write data to file
lib.create = function (dir, file, data, callback) {
  //open file for writing
  fs.open(
    lib.basedir + dir + "/" + file + ".json",
    "wx",
    function (err, fileDescriptor) {
      if (!err && fileDescriptor) {
        //convert data to string
        const stringData = JSON.stringify(data);

        // write data to file
        fs.writeFile(fileDescriptor, stringData, function (err) {
          if (!err) {
            fs.close(fileDescriptor, function (err) {
              if (!err) {
                callback(false);
              } else {
                callback("Error to closing the new file");
              }
            });
          } else {
            callback("Error writing to new file");
          }
        });
      } else {
        callback("Could not create new file , It may Already exist");
      }
    }
  );
};

//read data from file

lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.basedir + dir}/${file}.json`, "utf8", (err, data) => {
    callback(err, data);
  });
};

//Update data function

lib.update = (dir , file, data, callback)=>{
  //file open for writing
  fs.open(`${lib.basedir+dir}/${file}.json`, 'r+', (err, fileDescriptor )=>{
    if(!err && fileDescriptor){
      //convert data to string
      const stringData = JSON.stringify(data);
      //truncate data
      fs.ftruncate(fileDescriptor,(err)=>{
        if(!err){
          fs.writeFile(fileDescriptor, stringData, (err)=>{
            if(!err){
              //file close 
              fs.close(fileDescriptor,(err)=>{
                if(!err){
                  callback(false)
                }else{
                  callback('Error to file closing')
                }
              })
            }else{
              callback('Error to Write into the file')
            }
          })
        }else{
          callback('Error to truncate file')
        }
      })
    }else{
      callback('Error Updating. File mey not existing')
    }
  })
}


//function for delete
lib.delete = (dir, file, callback)=>{
  fs.unlink(`${lib.basedir+dir}/${file}.json`, (err)=>{
    if(!err){
      callback(false)
    }else{
      callback('Error to deleting file')
    }
  })
}

module.exports = lib;
