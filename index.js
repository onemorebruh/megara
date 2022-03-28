//	 _ __ ___   ___  __ _  __ _ _ __ __ _ 
//	| '_ ` _ \ / _ \/ _` |/ _` | '__/ _` |
//	| | | | | |  __/ (_| | (_| | | | (_| |
//	|_| |_| |_|\___|\__, |\__,_|_|  \__,_|
//					|___/                 

//web server
const express = require("express");
const app = express();
const jsonPaser = express.json();
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
const Log = require("./models/log");

//config
const config = require("./config");
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
		req.session.username = username
		res.json({
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
});
app.post("/login", jsonPaser, async function(req, res){
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
				url: `${config.protocol}://${config.ip}:${config.port}?username=${username}`});
		} else {
			res.json({
				'url': `${config.protocol}://${config.ip}:${config.port}/bdusr`
			});
		}

	} catch {
		res.json({
			'url': `${config.protocol}://${config.ip}:${config.port}/bdusr`
		});
	}
});

app.post("/adminlogin", jsonPaser, async function(req, res){
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
);

app.post("/readDB", jsonPaser, async function(req, res){
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
});

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

app.post("/DBdelete", jsonPaser, async function(req, res){
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
})

app.post("/DBedit", jsonPaser, async function(req, res){
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
})

app.get("/login", function(req, res) {
	res.sendFile(__dirname + "/static/login/index.html");
});

app.get("/bdusr", function(req, res) {
	res.sendFile(__dirname + "/static/bdusr/index.html");
});

app.get("/", async function(req, res) {
	if (!req.session.username){//redirect
		res.redirect(`${config.protocol}://${config.ip}:${config.port}/login`)
		
	} else {
		logAction(req.session.username, "loged as user");
		res.sendFile(__dirname + "/static/homepage/index.html");
	}
});

app.get("/admin", function(req, res) {
	var device = req.get("user-agent");
	if (!req.session.username){//redirect
		res.redirect(`${config.protocol}://${config.ip}:${config.port}/adminLogin`)
	} else {
		logAction(req.session.username, "loged as admin");
		if (device.includes("Apple")) {//even android devices have AppleWebKit in user-agent
			res.sendFile(__dirname + "/static/admin/mobile.html");
		} else {
			res.sendFile(__dirname + "/static/admin/desktop.html");
		}
	}
});

app.get("/adminLogin", function(req, res) {
	res.sendFile(__dirname + "/static/adminLogin/index.html");
});

app.use(express.static(__dirname + "/static"));
app.listen(config.port, config.ip );

module.exports.app = app;

function logAction (user, action){
	try{
		let time = Date();
		const log = new Log({username: user, action: action, time: time})
		log.save();
	} catch (err){
		console.log(err)
	}
}