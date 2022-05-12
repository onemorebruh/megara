const express = require("express");
const userRouter = express.Router();
const jsonPaser = express.json();
const config = require("../config");
const Log = require("../models/log");

userController = require("../controllers/userController");

userRouter.post("/Reg", jsonPaser, userController.reg);

userRouter.post("/login", jsonPaser, userController.login);

userRouter.get("/login", function(req, res) {
	res.sendFile(__dirname.slice(0, (__dirname.length -7)) + "/static/login/index.html");
});

userRouter.get("/bdusr", function(req, res) {
	res.sendFile(__dirname.slice(0, (__dirname.length -7)) + "/static/bdusr/index.html");
});

userRouter.get("/", async function(req, res) {
	if (!req.session.username){//redirect
		res.redirect(`${config.protocol}://${config.ip}:${config.port}/user/login`)
		
	} else {
		logAction(req.session.username, "loged as user");
		res.sendFile(__dirname.slice(0, (__dirname.length -7)) + "/static/homepage/index.html");
	}
});


module.exports = userRouter;


function logAction (user, action){
	try{
		let time = Date();
		const log = new Log({username: user, action: action, time: time})
		log.save();
	} catch (err){
		console.log(err)
	}
}