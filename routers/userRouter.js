const express = require("express");
const userRouter = express.Router();
const jsonPaser = express.json();
const config = require("../config");
const Log = require("../models/log");
const Logger = require("../Logger.js");
const { request } = require("express");

const logger = new Logger.Logger();


userController = require("../controllers/userController");

userRouter.post("/Reg", jsonPaser, userController.reg);

userRouter.post("/login", jsonPaser, userController.login);

userRouter.get("/login", function(request, response) {
  response.sendFile(__dirname.slice(0, (__dirname.length -7)) + "/static/login/index.html");// __dirname.length -7 is dirname without controllers
});

userRouter.get("/bdusr", function(request, response) {
  response.sendFile(__dirname.slice(0, (__dirname.length -7)) + "/static/bdusr/index.html");// __dirname.length - 7 is dirname without controllers
});

userRouter.get("/", async function(request, response) {
  var date = new Date().toISOString();
  if (!request.session.username){//redirect
    logger.log(`${date} ${request.headers['x-forwaeded-for']} tried to connect as unknown user`);
		response.redirect(`${config.protocol}://${config.ip}:${config.port}/user/login`);
	} else {
    logger.log(`${date} ${request.session.username} loged in as user`);
		response.sendFile(__dirname.slice(0, (__dirname.length -7)) + "/static/homepage/index.html");
	}
});


module.exports = userRouter;


