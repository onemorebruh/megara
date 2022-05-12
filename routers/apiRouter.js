const express = require("express");
const apiRouter = express.Router();
const jsonPaser = express.json();
const config = require("../config");

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/users");
const Admin = require("../models/adminuser");
const Log = require("../models/log");

const DBController = require("../controllers/DBController");
const fileController = require("../controllers/fileController");

apiRouter.post("/file/new", jsonPaser, fileController.new);

apiRouter.post("/DB/read", jsonPaser, DBController.read);

apiRouter.post("/readFiles", jsonPaser, async function(req, res){
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

apiRouter.post("/file/delete", jsonPaser, fileController.delete)

apiRouter.post("/file/edit", jsonPaser, fileController.edit)

apiRouter.post("/DB/delete", jsonPaser, DBController.delete)

apiRouter.post("/DB/edit", jsonPaser, DBController.edit)

module.exports = apiRouter;

