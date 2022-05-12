const express = require("express");
const adminRouter = express.Router();
const jsonPaser = express.json();
const config = require("../config");

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/users");
const Admin = require("../models/adminuser");
const Log = require("../models/log");
const adminController = require("../controllers/adminController");

adminRouter.post("/reg", jsonPaser, adminController.reg);

adminRouter.post("/login", jsonPaser, adminController.login);

adminRouter.get("/", function(req, res) {
	var device = req.get("user-agent");
	if (!req.session.username){//redirect
		res.redirect(`${config.protocol}://${config.ip}:${config.port}/admin/login`)
	} else {
		logAction(req.session.username, "loged as admin");
		if (device.includes("Apple")) {//even android devices have AppleWebKit in user-agent
			res.sendFile(__dirname.slice(0, (__dirname.length -7)) + "/static/admin/mobile.html");
		} else {
			res.sendFile(__dirname.slice(0, (__dirname.length -7)) + "/static/admin/desktop.html");
		}
	}
});

adminRouter.get("/login", function(req, res) {
	res.sendFile(__dirname.slice(0, (__dirname.length -7)) + "/static/adminLogin/index.html");
});

module.exports = adminRouter;



function logAction (user, action){
	try{
		let time = Date();
		const log = new Log({username: user, action: action, time: time})
		log.save();
	} catch (err){
		console.log(err)
	}
}