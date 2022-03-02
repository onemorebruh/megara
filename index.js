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
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");

//database
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
mongoose.connect("mongodb://localhost:27017/megara", { useUnifiedTopology: true, useNewUrlParser: true});
const User = require("./models/users");
const Admin = require("./models/adminuser");

//config
const config = require("./config");
const req = require("express/lib/request");// wtf is this?
const auth = require("./middleware/auth");
console.table(config);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser(config.signature));
app.use(expressSession({
		secret: config.signature,
}));

app.post("/userReg", jsonPaser, async function(req, res){
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
		var token = await generate_token(username, email, config.signature, "6h");
		res.json({'token': token});
	} //else prompt "such user already exist"
	req.session.username = username
	res.redirect(`http://${config.ip}:${config.port}/`)
});

app.post("/login", jsonPaser, async function(req, res){
	if(!req.body) return res.sendStatus(400);
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
		token = await generate_token(username, email, config.signature, "6h");
	}
	req.session.username = username
	console.log("user is succesfully validated")
	res.redirect(`..`)
});

app.post("/adminlogin", jsonPaser, async function(req, res){
	if(!req.body) return res.sendStatus(400);
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
		token = await generate_token(username, email, config.signature, "6h");
		res.json({
			'token': token,
			'url': `http://${config.ip}:${config.port}/admin?user=${fromDb._id}`
		});
	}
	res.json({
		'url': `http://${config.ip}:${config.port}/bdusr`
	});
});

app.get("/login", function(req, res) {
	res.sendFile(__dirname + "/static/login/index.html");
});

app.get("/bdusr", function(req, res) {
	res.sendFile(__dirname + "/static/bdusr/index.html");
});

app.get("/", function(req, res) {
	if (!req.session.username){//redirect
		res.redirect(`http://${config.ip}:${config.port}/login`)
	} else {
		res.sendFile(__dirname + "/static/homepage/index.html");
	}
});

app.get("/users", auth, function(req, res) {
	var users = User.find()
	console.log(users)
	res.send(users)
});

app.get("/admin", auth, function(req, res) {
	res.sendFile(__dirname + "/static/admin/index.html");
});

app.get("/adminLogin", function(req, res) {
	res.sendFile(__dirname + "/static/adminLogin/index.html");
});

app.use(express.static(__dirname + "/static"));
app.listen("3000");

async function generate_token(username, email, signature, expiration){
	let token = jwt.sign({username, email}, signature, {expiresIn: expiration});
	return token;
}