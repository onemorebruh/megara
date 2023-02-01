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
const Logger = require("../Logger.js");

const logger = new Logger.Logger();

adminRouter.post("/reg", jsonPaser, adminController.reg);

adminRouter.post("/login", jsonPaser, adminController.login);

adminRouter.get("/", function(request, response) {
  var device = request.get("user-agent");
  var date = new Date().toISOString();
	if (!request.session.username){//redirect
    response.redirect(`${config.protocol}://${config.ip}:${config.port}/admin/login`)
    logger.log(`${date} ${request.headers['x-forwarded-for']} tried to connect as admin\n`)
	} else {
    logger.log(`${date} ${request.session.username} loged as admin\n`);
		if (device.includes("Mobile")) {
			response.sendFile(__dirname.slice(0, (__dirname.length -7)) + "/static/admin/mobile.html");
		} else {
			response.sendFile(__dirname.slice(0, (__dirname.length -7)) + "/static/admin/desktop.html");
		}
	}
});

adminRouter.get("/login", function(req, res) {
	res.sendFile(__dirname.slice(0, (__dirname.length -7)) + "/static/adminLogin/index.html");
});

module.exports = adminRouter;



