
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

exports.reg= async function(req, res){
	if(!req.body) return res.sendStatus(400);
	let username, email, password
    username = req.body.username;
	email = req.body.email;
	password = req.body.password;
	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(password, salt)
	//TODO validation
	//check for existing
	const fromDb = await User.findOne({email}).exec();
	if (fromDb === null){
		//add to db
		const user = new User({username: username, email: email, password: hash});
		user.save(function(err){
			if(err) return console.log(err);
		});
		req.session.username = username
		res.json({
			url: `${config.protocol}://${config.ip}:${config.port}/user?username=${username}`});
	} else {
		res.json({
			"message": "such user already exists",
			'url': `${config.protocol}://${config.ip}:${config.port}/user/bdusr`
		});
	}
}

exports.login = async function(req, res){
	if(!req.body) return res.sendStatus(400);
	// gather data
	let username, email, password
    username = req.body.username;
	email = req.body.email;
	password = req.body.password;
	// find user in db
	const fromDb = await User.findOne({username}).exec();
	// compare user from form and from db
	try{
		areTheSame = await bcrypt.compareSync(password, fromDb.password);
		if (areTheSame === true && email ==fromDb.email) {
			req.session.username = username
			req.session._id = fromDb._id
			res.json({
				'url': `${config.protocol}://${config.ip}:${config.port}/user?username=${username}`});
		} else {
			res.json({
				'url': `${config.protocol}://${config.ip}:${config.port}/user/bdusr`
			});
		}

	} catch {
		res.json({
			'url': `${config.protocol}://${config.ip}:${config.port}/user/bdusr`
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