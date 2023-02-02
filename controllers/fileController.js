
const config = require("../config");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/users");
const Admin = require("../models/adminuser");
const Log = require("../models/log");
const File = require("../models/file");

const express = require("express");
const app = express();
const jsonPaser = express.json();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const fs = require('fs');
const Logger = require("../Logger");

const logger = new Logger.Logger();

exports.new = async function(request, response){
  var date = new Date().toISOString();
	if(!request.body) return response.sendStatus(400);
	let username, text, filename, message, docs, file;
    username = request.body.username;
	text = request.body.text;
	filename = request.body.filename;
	//check for extention
	if(filename.includes(".") == false){
		filename += ".txt"
	}
	//check for user in db
	let user = await User.findOne({username}).exec();
	if(user){
    docs = user.documents;
    message = 'file is succesfully saved';
    file = new File(
            {filename: filename,
              owner: user._id,
              blob: null,
              text: text
            }
    );
    await file.save();
    let savedFile = await File.findOne({filename}).exec();
		await user.documents.push(savedFile._id);
		await User.findByIdAndUpdate(user._id, {documents: user.documents}).exec();
		response.json({message: message});
  } else {
		response.json({
			message: "something is wrong with your username, you have to use it's  website to save files"
		})
	}

	}

exports.delete = async function(request, response){//TODO fix it
  var date = new Date().toISOString();
	if(!request.body) return response.sendStatus(400);
	let filename = request.body.filename;
	let username = request.body.username;
	const user = await User.findOne({username}).exec();
  let file = await File.findOneAndDelete({filename}).exec();
  //delete file form user
    let docs = user.documents
     docs = docs.filter(doc => file._id.equals(doc));
    await user.updateOne({documents: docs});
	response.json({
		message: "file was succesfully deleted"
  });
  logger.log(`${date} ${username} deleted file ${__dirname}/${username}/${filename}`);
}

exports.edit = async function(request, response){
  var date = new Date().toISOString();
	if(!request.body) return response.sendStatus(400);
	let filename = request.body.filename;
	let username = request.body.username;
	let filedata;
	const file = await File.findOne({filename}).exec();
  try{
    let filedata = file.text;
		response.json({
			text: filedata,
		});
	} catch {
	  logger.error(`${date} user ${username} have unseccesfully tried to edit ${file}`)
		res.json({
			text: "something is wrong with file. please try again"
		})
	}
}


