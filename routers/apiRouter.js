const express = require("express");
const apiRouter = express.Router();
const jsonPaser = express.json();
const config = require("../config");

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/users");
const Admin = require("../models/adminuser");
const Log = require("../models/log");
const File = require("../models/file");

const DBController = require("../controllers/DBController");
const fileController = require("../controllers/fileController");

apiRouter.post("/file/new", jsonPaser, fileController.new);

apiRouter.get("/DB/read", jsonPaser, DBController.read);

apiRouter.get("/readFiles", jsonPaser, async function(request, response){
	if(!request.body) return response.sendStatus(400);
	//get data from db to show documents
  try{
    let files = await File.find({}).exec();
		response.json({
			documents: files
		});
	} catch {
		return response.sendStatus(400);
	}
});

apiRouter.post("/file/delete", jsonPaser, fileController.delete)

apiRouter.post("/file/edit", jsonPaser, fileController.edit)

apiRouter.delete("/DB/delete", jsonPaser, DBController.delete)

apiRouter.post("/DB/edit", jsonPaser, DBController.edit)

module.exports = apiRouter;

