
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

exports.new = async function(req, res){
	if(!req.body) return res.sendStatus(400);
	let username, text, filename, message, docs;
    username = req.body.username;
	text = req.body.text;
	filename = req.body.filename;
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
					console.log(message)
				res.json({message: message})
			} catch (err){
				console.log(`error -> ${err}`);
				setTimeout(() => {
					message = 'something is wrong with your file. it is not saved :('
					res.json({message: message})
				}, 30)
			}
			console.log(message)

		}
		//send message back
	} else {console.log(message)
		res.json({
			message: "something is wrong with your username, you have to use it's  website to save files"
		})
	}

	}

exports.delete = async function(req, res){
	if(!req.body) return res.sendStatus(400);
	let filename = req.body.filename;
	let username = req.body.username;
	const fromDb = await User.findOne({username}).exec();
	docs = fromDb.documents
	docs.forEach( function (doc, i, docs){
		console.log(doc, `${__dirname}/${username}/${filename}`)
		if(doc == `${__dirname}/public/${username}/${filename}`){
			console.log(true, i)
			docs = docs.splice(i, 1)
		} else{
			console.log(false, i)
		}
	})
	User.updateOne({username: username}, {documents: docs}, function(err, result){
		if(err) return console.log(err);
	});
	fs.rmSync(`${__dirname}/public/${username}/${filename}`)
	res.json({
		message: "file was succesfully deleted"
	});
}

exports.edit = async function(req, res){
	if(!req.body) return res.sendStatus(400);
	let filename = req.body.filename;
	let username = req.body.username;
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
		res.json({
			text: filedata,
			binary: undefined
		});
	} catch {
		console.log(username, fromDb)
		res.json({
			text: "something is wrong with file. please try again"
		})
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