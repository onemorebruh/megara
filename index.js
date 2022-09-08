const express = require("express");
const session = require("express-session");
const { where } = require("sequelize");
const app = express();
const jsonParser = express.json();
const Sequelize = require("sequelize");
const config = require("./config");
const {User, Log, File} = require("./models");

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
		response.sendFile(__dirname + "/templates/login/index.html");
});

app.get("/badUser", function( request, response) {
		response.sendFile(__dirname + "/templates/badUser/index.html");
});

app.get("/admin", async function (request, response){
		//check for admin
		user = await User.findAll({
			where: {
				login: request.session.username
			}
		})
		user =  user[0]
		if(user.dataValues.accessToLogs == true){
				response.sendFile(__dirname + "/templates/admin/index.html");
		}else{
				response.sendFile(__dirname + "/templates/badUser/index.html");
		}
});


app.get("/user", function (request, response){
		//check for user
		if(request.session.username != undefined){
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
				//create new user
				var record = User.build({ login: newUserInfo.login, password: newUserInfo.password, accessToLogs: 0, accessToUsers: 0, accessToFiles: 0});
				await record.save();
				request.session.username = newUserInfo.login;
				response.json({"message": "user succesfully registred", "url": `user&user=${newUserInfo.login}`});
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
		writeLog(userInfo.login, "tried to login");
		if (result[0] || result[0].password == userInfo.password){//there is such user so check the passwords
				request.session.username = userInfo.login;
				response.json({
						"message": "password is correct. press the 'ok' to move to the homepage",
						"url": `user?user=${userInfo.login}`
				});
		}else {
				response.json({
						"message": "wrong password or user with such login does not exist",
						"url": ""
				});
		}
});

app.get("/user/db/files", async function (request, response){
	console.log(request.session.username)
	if(request.session.username == undefined){
		response.redirect(`${config.protocol}://${config.ip}:${config.port}`);
	}else{
		let userId = await User.findAll({
			where:{
				login: request.session.username
			}
		});
		userId = userId[0].dataValues.id;
		console.log(userId)
		//find all files of user
		let files = await File.findAll({
			where: { userId: userId}
		});
		console.log(files)
		//return array of files
		response.json(files);
	}
});

app.get("/admin/db/log", async function (request, response){
		if (request.session.accessToLogs == true){
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
								request.session.username = request.body.login;
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
		var record = Log.build({ userId: user[0].dataValues.id, action: data});
		await record.save();
};

