
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

exports.reg= async function(request, response){
	if(!require.body) return response.sendStatus(400);
	let username, email, password
    username = require.body.username;
	email = require.body.email;
	password = require.body.password;
	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(password, salt)
	//check for existing
	const fromDb = await User.findOne({email}).exec();
	if (fromDb === null){
		//add to db
		const user = new User({username: username, email: email, password: hash});
		user.save(function(err){
			if(err) return console.log(err);
		});
		request.session.username = username
		response.json({
			url: `${config.protocol}://${config.ip}:${config.port}/user?username=${username}`});
	} else {
		response.json({
			"message": "such user already exists",
			'url': `${config.protocol}://${config.ip}:${config.port}/user/bdusr`
		});
	}
}

exports.login = async function(request, response){
	if(!request.body) return response.sendStatus(400);
	// gather data
	let username, email, password
    username = request.body.username;
	email = request.body.email;
	password = request.body.password;
	// find user in db
	const fromDb = await User.findOne({username}).exec();
	// compare user from form and from db
	try{
		areTheSame = await bcrypt.compareSync(password, fromDb.password);
		if (areTheSame === true && email ==fromDb.email) {
			request.session.username = username
			request.session._id = fromDb._id
			response.json({
				'url': `${config.protocol}://${config.ip}:${config.port}/user?username=${username}`});
		} else {
			response.json({
				'url': `${config.protocol}://${config.ip}:${config.port}/user/bdusr`
			});
		}

	} catch {
		response.json({
			'url': `${config.protocol}://${config.ip}:${config.port}/user/bdusr`
		});
	}
}
