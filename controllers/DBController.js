
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

exports.read = async function(req, res){
	if(!req.body) return res.sendStatus(400);
	var readingObject = req.body.readingObject;
	var sortedFiles = [];
	switch(readingObject){
		case "user":
			try{
				var users = await User.find().exec();
				res.json({
					array: users
				});
			} catch {
				return res.sendStatus(400);
			}
			break
		case "admin":
			try{
				var admins = await Admin.find().exec();
				res.json({
					array: admins
				});
			} catch {
				return res.sendStatus(400);
			}
			break
		case "file":
			try{
				users = await User.find().exec();
				users.forEach(function(doc, i , users){
					let files = doc.documents;
					let id = doc._id
					files.forEach(function (doc, i , files){
						sortedFiles.push({_id: id, file: doc})
					})
				})
				res.json({
					array: sortedFiles
				});
			} catch (err) {
				console.log(err)
				return res.sendStatus(400);
			}
			break
	}
}

exports.delete = async function(req, res){
	if(!req.body) return res.sendStatus(400);
	let id = req.body.id;
	let filename =req.body.filename
	let database = req.body.database;
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
			console.log("bruh")
	}
	res.json({
		message: message
	})
}

exports.edit = async function(req, res){
	if(!req.body) return res.sendStatus(400);
	let id = req.body.id;
	let filename = req.body.filename
	let username = req.body.username;
	let database = req.body.database;
	let password = req.body.password;
	let email = req.body.email;
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
			console.log("bruh")
	}
	res.json({
		message: message
	})
}


function logAction (user, action){
	try{
		let time = Date();
		const log = new Log({username: user, action: action, time: time})
		log.save();
	} catch (err){
		console.log(err)
	}
}