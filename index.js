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
		response.sendFile(__dirname + "/templates/login/index.html");
});

app.get("/admin", function (request, response){
		//check for admin
		if(request.session.role == "admin"){
				response.sendFile(__dirname + "/templates/admin/index.html");
		}else{
				response.sendFile(__dirname + "/templates/badUser/index.html");
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
						response.json({"message": "error. there is no such user in database"});
				} else{
						//compare users by password
						console.log(dbUser[0].dataValues)
						if (dbUser[0].dataValues.password == request.body.password){
								request.session.role = "admin";
								response.json({"message": "user succesfully auntificated"})
						}else {
								response.json({"message": "error. wrong password"})
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
