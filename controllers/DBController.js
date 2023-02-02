
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

exports.read = async function(request, response){
  if(!request.body) return response.sendStatus(400);
  var urlString = request.url
  var readingObject = urlString.split("?")[1];
	console.log(readingObject);
	switch(readingObject){
		case "user":
			try{
				var users = await User.find().exec();
				response.json({
					array: users
				});
			} catch {
				return response.sendStatus(400);
			}
			break
		case "admin":
			try{
				var admins = await Admin.find().exec();
				response.json({
					array: admins
				});
			} catch {
				return response.sendStatus(400);
			}
			break
		case "file":
			try{
				let files = await File.find().exec();
				response.json({
					array: files
				});
			} catch (err) {
				console.log(err)
				return response.sendStatus(400);
			}
			break
	}
}

exports.delete = async function(request, response){
	if(!request.body) return response.sendStatus(400);
	let id = request.body.id;
	let filename =request.body.filename
	let database = request.body.database;
	let message = ""
	let fromDb;
	let fileArray;
	switch (database){
		case "user":
			fromDb = await User.findByIdAndDelete(id).exec();
			message = "user is succesfully deleted"
			break
		case "admin":
			fromDb = await Admin.findByIdAndDelete(id).exec();
			message = "admin is succesfully deleted"
			break
		case "file":
			fromDb = await User.findById(id).exec();
			fileArray = fromDb.documents
			fileArray.forEach(function (doc, i, fileArray){
				if (filename == doc){
					console.log(fileArray)
					fileArray =fileArray.splice(i, 1)
					console.log(fileArray)
				}
			})
			User.findByIdAndUpdate(id, {documents: fileArray}).exec()
			message = "file is succesfully deleted"
			break
		default:
			break
	}
	response.json({
		message: message
	})
}

exports.edit = async function(request, response){
	if(!request.body) return response.sendStatus(400);
	let id = request.body.id;
	let filename = request.body.filename
	let username = request.body.username;
	let database = request.body.database;
	let password = request.body.password;
	let email = request.body.email;
	let message = ""
	let fromDb;
	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(password, salt)
	switch (database){
		case "user":
			fromDb = await User.findByIdAndUpdate(id, {username: username, email: email, password: hash}).exec();
			message = "user is succesfully updated"
			break
		case "admin":
			fromDb = await Admin.findByIdAndUpdate(id, {username: username, email: email, password: hash}).exec();
			message = "admin is succesfully updated"
			break
		default:
			break
	}
	response.json({
		message: message
	})
}

   
