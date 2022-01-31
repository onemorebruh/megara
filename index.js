//	 _ __ ___   ___  __ _  __ _ _ __ __ _ 
//	| '_ ` _ \ / _ \/ _` |/ _` | '__/ _` |
//	| | | | | |  __/ (_| | (_| | | | (_| |
//	|_| |_| |_|\___|\__, |\__,_|_|  \__,_|
//					|___/                 

//web server
const express = require("express");
const app = express();
const jsonPaser = express.json();
const jwt = require("jsonwebtoken");

//database
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
mongoose.connect("mongodb://localhost:27017/megara", { useUnifiedTopology: true, useNewUrlParser: true});
const User = require("./model/users");
const cockies = require("./model/cockies");

//config
const config = require("./config");
const req = require("express/lib/request");
console.table(config);

app.post("/userReg", jsonPaser, async function(req, res){
	if(!req.body) return res.sendStatus(400);
	let username, email, password
    username = req.body.username;
	email = req.body.email;
	password = req.body.password;
	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(password, salt)
	//check for existing
	const fromDb = await User.findOne({username, email}).exec();
	if (fromDb === null){
		//add to db
		const user = new User({username: username, email: email, password: hash});
		user.save(function(err){
			if(err) return console.log(err);
		});
		var token = generate_token({username, email}, config.signature, "6h");
		//redirect
	} //else prompt "such user already exist"
});

app.post("/login", jsonPaser, async function(req, res){
	if(!req.body) return res.sendStatus(400);
	console.log(config)
	// gather data
	let token;
	let username, email, password
    username = req.body.username;
	email = req.body.email;
	password = req.body.password;
	// find user in db
	const fromDb = await User.findOne({username, email}).exec();
	// compare user from form and from db
	areTheSame = await bcrypt.compareSync(password, fromDb.password);
	if (areTheSame === true) {
		token = await generate_token({username, email}, config.signature, "6h");
	}
	//redirect
});

app.get("/", function(req, res) {
		res.sendFile(__dirname + "/static/homepage/index.html");
});

app.get("/login", function(req, res) {
	res.sendFile(__dirname + "/static/login/index.html");
});

app.use(express.static(__dirname + "/static"));
app.listen("3000");

function generate_token(data, signature, expiration){
	return jwt.sign({data}, signature, {expiresIn: expiration});
}