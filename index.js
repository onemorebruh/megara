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
const fs = require('fs');

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
		req.session.username = username
		res.json({
			token: token,
			url: `${config.protocol}://${config.ip}:${config.port}?username=${username}`});
	} else {
		res.json({
			"message": "such user already exists",
			'url': `${config.protocol}://${config.ip}:${config.port}/bdusr`
		});
	}
});

app.post("/adminReg", jsonPaser, async function(req, res){
	if(!req.body) return res.sendStatus(400);
	var collections = mongoose.connections[0].collections;
	let username, email, password, databases
    username = req.body.username;
	email = req.body.email;
	password = req.body.password;
	tables = [];

	Object.keys(collections).forEach(function(k) {
		tables.push(k);
	});

	console.log(tables);
	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(password, salt)
	//TODO validation
	//check for existing
	const fromDb = await Admin.findOne({email}).exec();
	if (fromDb === null){
		//add to db
		const admin = new Admin({username: username, email: email, password: hash, tables: tables});
		admin.save(function(err){
			if(err) return console.log(err);
		});
		var token = await generate_token(username, email, config.signature, "6h");
		req.session.username = username
		res.json({
			token: token,
			url: `${config.protocol}://${config.ip}:${config.port}/admin?username=${username}`});
	} //else prompt "such user already exist"
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
		req.session.username = username
		res.json({
			token: token,
			url: `${config.protocol}://${config.ip}:${config.port}?username=${username}`});
	} else {
		res.json({
			'url': `${config.protocol}://${config.ip}:${config.port}/bdusr`
		});
	}
});

app.post("/adminlogin", jsonPaser, async function(req, res){
	if(!req.body) return res.sendStatus(400);
	// gather data
	let token;
	let username, password
    username = req.body.username;
	password = req.body.password;
	// find user in db
	const fromDb = await Admin.findOne({username}).exec();
	// compare user from form and from db
	areTheSame = await bcrypt.compareSync(password, fromDb.password);
	if (areTheSame === true) {
		token = await generate_token(username, fromDb.email, config.signature, "6h");
		req.session.username = username
		res.json({
			token: token,
			url: `${config.protocol}://${config.ip}:${config.port}/admin?user=${fromDb._id}`
		});
	}
	res.json({
		'url': `${config.protocol}://${config.ip}:${config.port}/bdusr`
	});
});

app.post("/newFile", jsonPaser, async function(req, res){
	if(!req.body) return res.sendStatus(400);
	let username, text, filename, message, docs;
    username = req.body.username;
	text = req.body.text;
	filename = req.body.filename;
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
					await User.findByIdAndUpdate(fromDb._id, {documents: fromDb.documents}, function(err, doc) {
						if (err) return console.log(err);
						return console.log(doc, "\nsucessfully added");
					});
					console.log(message)
				res.json({message: message})
			} catch {
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
);

app.post("/readFiles", jsonPaser, async function(req, res){
	if(!req.body) return res.sendStatus(400);
	//get data from db to show documents
	try{
		user = await User.findOne({username: req.session.username}).exec();
		res.json({
			documents: user.documents
		});
	} catch {
		return res.sendStatus(400);
	}
});

app.post("/deleteFile", jsonPaser, async function(req, res){
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
})

app.post("/editFile", jsonPaser, async function(req, res){
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
})

app.get("/login", function(req, res) {
	res.sendFile(__dirname + "/static/login/index.html");
});

app.get("/bdusr", function(req, res) {
	res.sendFile(__dirname + "/static/bdusr/index.html");
});

app.get("/", async function(req, res) {
	let user;
	if (!req.session.username){//redirect
		res.redirect(`${config.protocol}://${config.ip}:${config.port}/login`)
		
	} else {
		res.sendFile(__dirname + "/static/homepage/index.html");
	}
});

app.get("/admin", auth, function(req, res) {
	res.sendFile(__dirname + "/static/admin/index.html");
});

app.get("/adminLogin", function(req, res) {
	res.sendFile(__dirname + "/static/adminLogin/index.html");
});

app.use(express.static(__dirname + "/static"));
app.listen(config.port, config.ip );

async function generate_token(username, email, signature, expiration){
	let token = jwt.sign({username, email}, signature, {expiresIn: expiration});
	return token;
}