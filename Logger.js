const fs = require("fs");

exports.Logger = class Logger{
  constructor(){
    //check for existing folder
    if(!fs.existsSync(`${__dirname}/log/`)){
      fs.mkdirSync(`${__dirname}/log/`);
    }
  }

  log(message){
    //write message to log file
    fs.appendFileSync(`${__dirname}/log/logs.log`, message + '\n');
  }

  error(message){
    //write message to error file
    fs.appendFileSync(`${__dirname}/log/error.log`, message + '\n');
  }

}
