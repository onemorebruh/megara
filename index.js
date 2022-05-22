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
mongoose.connect(config.dburl, { useUnifiedTopology: true, useNewUrlParser: true});
const User = require("./models/users");
const Admin = require("./models/adminuser");
const Log = require("./models/log");

//config
const config = require("./config");
console.table(config);

//routers
const userRouter = require("./routers/userRouter");
const adminRouter = require("./routers/adminRouter");
const apiRouter = require("./routers/apiRouter");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser(config.signature));
app.use(expressSession({
		secret: config.signature,
}));

app.use("/user", userRouter);

app.use("/admin", adminRouter);

app.use('/api', apiRouter)

app.get("/", function(req, res){
	res.redirect(`${config.protocol}://${config.ip}:${config.port}/user/login`);
})

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