const express = require("express");
const app = express();
const jsonParser = express.json();
const Sequelize = require("sequelize");
const config = require("./config");

const sequelize = new Sequelize(config.db, config.db_user, config.db_password, {
  dialect: "mariadb",
  host: config.ip
});

app.use(express.static(__dirname + "/static"));

app.get("/", function (request, response){
		response.sendFile(__dirname + "/templates/login/index.html");
});

app.get("/admin", function (request, response){
		response.sendFile(__dirname + "/templates/admin/index.html");
});

app.post("/admin", jsonParser, function (request, response){
		if(!request.body){
				return response.sendStatus(400);
		} else {
				response.json({"message": "success"});
		}
});

console.table(config);

app.listen(config.port, config.ip);
