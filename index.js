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
const config = require("./config");

//database
const bcrypt = require("bcryptjs");
//config
console.table(config);

//routers
const userRouter = require("./routers/userRouter");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser(config.signature));
app.use(expressSession({
		secret: config.signature,
}));

app.use("/user", userRouter);


app.get("/", function(req, res){
	res.send("aboba");
})

app.use(express.static(__dirname + "/static"));
app.listen(config.port, config.ip );

module.exports.app = app;