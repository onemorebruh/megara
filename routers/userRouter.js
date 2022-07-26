const express = require("express");
const userRouter = express.Router();
const jsonPaser = express.json();
const config = require("../config");
const { Sequelize } = require('sequelize');
const userController = require("../controllers/userController");

userRouter.get("/users", jsonPaser, userController.showUsers)

module.exports = userRouter;