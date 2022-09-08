const express = require("express");
const session = require("express-session");
const app = express();
const jsonParser = express.json();
const Sequelize = require("sequelize");
const config = require("./config");
const {User, Log, File, Role} = require("./models");

const sequelize = new Sequelize(config.db, config.db_user, config.db_password, {//database connection
  dialect: "mariadb",
  host: config.ip,
  logging: false,
});

app.use(session({// adds sessions
		secret: config.secret,
		saveUnitialized: true,
}));
app.use(express.static(__dirname + "/static"));// adds static files

app.get("/", function (request, response){
		request.session.role = "Guest";
		response.sendFile(__dirname + "/templates/login/index.html");
});

app.get("/badUser", function( request, response) {
		response.sendFile(__dirname + "/templates/badUser/index.html");
});

app.get("/admin", function (request, response){
		//check for admin
		if(request.session.role == "Admin"){
				response.sendFile(__dirname + "/templates/admin/index.html");
		}else{
				response.sendFile(__dirname + "/templates/badUser/index.html");
		}
});


app.get("/user", function (request, response){
		//check for admin
		if(request.session.role != "Guest"){
				response.sendFile(__dirname + "/templates/homepage/index.html");
		}else{
				response.sendFile(__dirname + "/templates/badUser/index.html");
		}
});

app.post("/user/reg", jsonParser, async function (request, response) {
		let newUserInfo = {
				login: request.body.login,
				password: request.body.password
		};
		//check for being unique
		result = await User.findAll({
				where: {
						login: newUserInfo.login
				},
				limit: 1
		});
		if(result[0]){//find user with the same name
				response.json({"message": "such user already exists, please use another login"});
		} else{
				//create new user (user role by default)
				request.session.role = "User"
				var record = User.build({ login: newUserInfo.login, password: newUserInfo.password, roleId: 3});
				await record.save();
				response.json({"message": "user succesfully registred", "url": "user/home"});
				writeLog(newUserInfo.login, "was succesfully registred");
		}
});

app.post("/user/login", jsonParser, async function (request, response) {
		let userInfo = {
				login: request.body.login,
				password: request.body.password
		};
		result = await User.findAll({//get the same user from db to compare
				where: {
						login: userInfo.login
				},
				limit: 1
		});
		if (result[0] || result[0].password == userInfo.password){//there is such user so check the passwords
				request.session.role = "User"
				response.json({
						"message": "password is correct. press the 'ok' to move to the homepage",
						"url": "user"
				});
		}else {
				response.json({
						"message": "wrong password or user with such login does not exist",
						"url": ""
				});
		}
});

app.get("/admin/db/log", async function (request, response){
		if (request.session.role == "Admin"){
		//get all logs and send them
		log = await Log.findAll();
				response.json(log);
		} else {
				response.send({"message": "access denied"});
		}
});

app.post("/admin", jsonParser, async function (request, response){

		//get request and send response
		if(!request.body){
				return response.sendStatus(400);
		} else {
				//wirte activity to the log
				writeLog(request.body.login, "tried to log in as admin");
				dbUser = await User.findAll({
						where: {
								login: request.body.login,
						},
						limit: 1,
				});
				if (!dbUser[0]){//no user so browser gets error message
						response.json({"message": "error. there is no such user in database",
						"url": ""});
				} else{
						//compare users by password
						console.log(dbUser[0].dataValues)
						if (dbUser[0].dataValues.password == request.body.password){
								request.session.role = "Admin";
								response.json({"message": "user succesfully auntificated",
												"url": "admin"});
						}else {
								response.json({"message": "error. wrong password",
												"url": "badUser"});
						}
				}
		}
});

console.table(config);

app.listen(config.port, config.ip);

async function writeLog (username, data){//for 1 line logging
		user = await User.findAll({
				where: {
						login: username,
				},
				limit: 1
		});
		if (!user[0].dataValues.id){
				user.dataValues.id = 2;
		}
		var record = Log.build({ userId: user[0].dataValues.id, action: data});
		await record.save();
}
