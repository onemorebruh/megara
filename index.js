//	 _ __ ___   ___  __ _  __ _ _ __ __ _ 
//	| '_ ` _ \ / _ \/ _` |/ _` | '__/ _` |
//	| | | | | |  __/ (_| | (_| | | | (_| |
//	|_| |_| |_|\___|\__, |\__,_|_|  \__,_|
//					|___/                 

//web server
const express = require("express");
const app = express();
const jsonPaser = express.json();

//database
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
mongoose.connect("mongodb://localhost:27017/usersdb", { useUnifiedTopology: true, useNewUrlParser: true });
const User = require("./model/users");
const cockies = require("./model/cockies");
//config
const config = require("./config");
console.table(config);

app.post("/userReg", jsonPaser, function(req, res){
	if(!req.body) return res.sendStatus(400);
	console.log("post")
	let username, email, password
    username = req.body.username;
	email = req.body.email;
	password = req.body.password;
	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(password, salt)
	const user = new User({username: username, email: email, password: hash});
	user.save(function(err){
        if(err) return console.log(err);
    });
});

app.get("/", function(req, res) {
		res.sendFile(__dirname + "/static/homepage/index.html");
});

app.get("/login", function(req, res) {
	res.sendFile(__dirname + "/static/login/index.html");
});

app.use(express.static(__dirname + "/static"));
app.listen("3000");
