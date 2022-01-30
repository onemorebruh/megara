//	 _ __ ___   ___  __ _  __ _ _ __ __ _ 
//	| '_ ` _ \ / _ \/ _` |/ _` | '__/ _` |
//	| | | | | |  __/ (_| | (_| | | | (_| |
//	|_| |_| |_|\___|\__, |\__,_|_|  \__,_|
//					|___/                 

//web server
const express = require("express");
const app = express();
const jsonPasers = express.json();

//database


//config
const config = require("./config");
console.table(config);

app.get("/", function(req, res) {
		res.sendFile(__dirname + "/static/homepage/index.html");
});

app.get("/login", function(req, res) {
	res.sendFile(__dirname + "/static/login/index.html");
});

app.use(express.static(__dirname + "/static"));
app.listen("3000");
