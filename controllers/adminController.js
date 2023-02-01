
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
const { resourceUsage } = require("process");

const logger = new Logger.Logger();


exports.reg = async function(request, response){
  var date = new Date().toISOString();
	if(!request.body) return response.sendStatus(400);
	var collections, username, email, password, salt, hash, fromDb, admin;
	if (!request.session._id){
		response.sendStatus(403);
	} else{
    admin = await Admin.findById(request.session._id).exec();//checks for admin in database
		logger.log(`${date} ${admin.username} created new admin`);
		if (admin.tables.includes("admins")){
			collections = mongoose.connections[0].collections;
			username = request.body.username;
			email = request.body.email;
			password = request.body.password;
			tables = [];
		
      Object.keys(collections).forEach(function(k) {//adds each collection to new admin
				tables.push(k);
			});
		
			logger.log(`${date} admin ${admin.username} addad admin with tables ${tables}`);
			salt = bcrypt.genSaltSync(10);
			hash = bcrypt.hashSync(password, salt)
			//check for existing
			fromDb = await Admin.findOne({email}).exec();
			if (fromDb === null){
				//add to db
				admin = new Admin({username: username, email: email, password: hash, tables: tables});
				admin.save(function(err){
					if(err) return logger.log(`${date} ${err}`);
				});
				response.json({
					message: "admin was succesfully added"});
			} else {
				response.sendStatus(400);
			}
		}
	}
}

exports.login = async function(request, response){
  var date = new Date().toISOString();
	if(!request.body) return response.sendStatus(400);
	// gather data
	let username, password
    username = request.body.username;
	password = request.body.password;
	// find user in db
	const fromDb = await Admin.findOne({username}).exec();
	// compare user from form and from db
	try{
		areTheSame = await bcrypt.compareSync(password, fromDb.password);
		if (areTheSame === true) {
			request.session.username = username
			request.session._id = fromDb._id
			response.json({
				url: `${config.protocol}://${config.ip}:${config.port}/admin?user=${fromDb._id}`
			});
		} else {
			response.json({
				'url': `${config.protocol}://${config.ip}:${config.port}/bdusr`
			});
		}
	} catch (err){
		logger.log(`${date} ${err}`)
		response.json({
			'url': `${config.protocol}://${config.ip}:${config.port}/bdusr`
		});
	}
}


