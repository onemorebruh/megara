const config = require("../config");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.db_name, config.db_user, config.db_user_password, {
		dialect: "mysql",
		host: config.db_host,
})

//models
const User = require("../models")(sequelize);

exports.showUsers= async function(req, res) {

		res.json()//sendFile(__dirname.slice(0, (__dirname.length -11)) + "static/users/index.html"); //it's __dirname contains controller
}
