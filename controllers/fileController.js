
const config = require("../config");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/users");
const Admin = require("../models/adminuser");
const Log = require("../models/log");
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
	let username, text, filename, message, docs;
    username = request.body.username;
	text = request.body.text;
	filename = request.body.filename;
	//check for extention
	if(filename.includes(".") == false){
		filename += ".txt"
	}
	//check for user in db
	const fromDb = await User.findOne({username}).exec();
	if(fromDb){
		//check for existing
		docs = fromDb.documents
		if (docs.includes(`${__dirname}/public/${username}/${filename}`)){
			//rewrite file
			fs.writeFileSync(`${__dirname}/public/${username}/${filename}`, text);
		} else {
			//save file in personal directory
			try{
				if(!fs.existsSync(`${__dirname}/public/${username}/`)) {//check for directory
					fs.mkdirSync(`${__dirname}/public/${username}/`)
				}
				if(fs.existsSync(`${__dirname}/public/${username}/${filename}`)){
					message = 'such file already exists';
				} else {
					fs.writeFileSync(`${__dirname}/public/${username}/${filename}`, text);
					message = 'file is succesfully saved';}
					fromDb.documents.push(`${__dirname}/public/${username}/${filename}`)
					await User.findByIdAndUpdate(fromDb._id, {documents: fromDb.documents}).exec();
				response.json({message: message})
			} catch (err){
				logger.log(`${date} ${err}`);
				setTimeout(() => {
					message = 'something is wrong with your file. it is not saved :('
					response.json({message: message})
				}, 30)
			}

		}
		//send message back
	} else {
		response.json({
			message: "something is wrong with your username, you have to use it's  website to save files"
		})
	}

	}

exports.delete = async function(request, response){
  var date = new Date().toISOString();
	if(!request.body) return response.sendStatus(400);
	let filename = request.body.filename;
	let username = request.body.username;
	const fromDb = await User.findOne({username}).exec();
	docs = fromDb.documents
	docs.forEach( function (doc, i, docs){
		logger.log(`${date} ${username} deleted file ${__dirname}/${username}/${filename}`)
    if(doc == `${__dirname}/public/${username}/${filename}`){//search for file in folder
			docs = docs.splice(i, 1)
		} else{
		}
	})
	User.updateOne({username: username}, {documents: docs}, function(err, result){
		if(err) return logger.error(`${date} ${err}`);
	});
	fs.rmSync(`${__dirname}/public/${username}/${filename}`)
	response.json({
		message: "file was succesfully deleted"
	});
}

exports.edit = async function(request, response){
  var date = new Date().toISOString();
	if(!request.body) return response.sendStatus(400);
	let filename = request.body.filename;
	let username = request.body.username;
	let filedata;
	const fromDb = await User.findOne({username}).exec();
	try{
		docs = fromDb.documents
		docs.forEach( function (doc, i, docs){
			if(doc == `${__dirname}/public/${username}/${filename}`){
				filedata = fs.readFileSync(doc, "utf8");
			} else{
			}
			if (filedata == undefined){
				filedata = "empty file"
			}
		})
		response.json({
			text: filedata,
		});
	} catch {
	  logger.error(`${date} user ${username} have unseccesfully tried to edit ${fromDb}`)
		res.json({
			text: "something is wrong with file. please try again"
		})
	}
}


