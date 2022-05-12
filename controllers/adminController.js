
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

exports.reg = async function(req, res){
	if(!req.body) return res.sendStatus(400);
	var collections, username, email, password, salt, hash, fromDb, admin;
	if (!req.session._id){
		res.sendStatus(400);
	} else{
		admin = await Admin.findById(req.session._id).exec();
		logAction(admin.username, "created new admin");
		if (admin.tables.includes("admins")){
			collections = mongoose.connections[0].collections;
			username = req.body.username;
			email = req.body.email;
			password = req.body.password;
			tables = [];
		
			Object.keys(collections).forEach(function(k) {
				tables.push(k);
			});
		
			console.log(tables);
			salt = bcrypt.genSaltSync(10);
			hash = bcrypt.hashSync(password, salt)
			//check for existing
			fromDb = await Admin.findOne({email}).exec();
			if (fromDb === null){
				//add to db
				admin = new Admin({username: username, email: email, password: hash, tables: tables});
				admin.save(function(err){
					if(err) return console.log(err);
				});
				res.json({
					message: "admin was succesfully added"});
			} else {
				res.sendStatus(400);
			}
		}
	}
}

exports.login = async function(req, res){
	if(!req.body) return res.sendStatus(400);
	// gather data
	let username, password
    username = req.body.username;
	password = req.body.password;
	// find user in db
	const fromDb = await Admin.findOne({username}).exec();
	// compare user from form and from db
	try{
		areTheSame = await bcrypt.compareSync(password, fromDb.password);
		if (areTheSame === true) {
			req.session.username = username
			req.session._id = fromDb._id
			res.json({
				url: `${config.protocol}://${config.ip}:${config.port}/admin?user=${fromDb._id}`
			});
		} else {
			res.json({
				'url': `${config.protocol}://${config.ip}:${config.port}/bdusr`
			});
		}
	} catch (err){
		console.log(err)
		res.json({
			'url': `${config.protocol}://${config.ip}:${config.port}/bdusr`
		});
	}
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