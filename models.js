const { Sequelize, DataTypes, Model } = require('sequelize');

const config = require("./config");

const sequelize = new Sequelize(config.db, config.db_user, config.db_password, {
  dialect: "mariadb",
  host: config.ip
});

const Log = sequelize.define("log", {
		id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
		},
		action: {
				type: Sequelize.TEXT,
				allowNull: false,
		},
});

const User = sequelize.define("user", {
		id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
		},
		login: {
				type: Sequelize.STRING,
				unique: true,
				allowNull: false,
		},
		password: {
				type: Sequelize.STRING,
				allowNull: false,
		},
		accessToLogs: {
				type: Sequelize.BOOLEAN,
				default: false,
		},
		accessToUsers: {
				type: Sequelize.BOOLEAN,
				default: false,
		},
		accessToFiles: {
				type: Sequelize.BOOLEAN,
				default: true
		},
});

const File = sequelize.define("file", {
		id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
		},
		name: {
				type: Sequelize.STRING,
		},
		text: {
				type: Sequelize.TEXT,
		},
		blob: { 
				type: Sequelize.BLOB("long"),
		},
});

Log.belongsTo(User);
File.belongsTo(User);

sequelize.sync({force: true}).then(result=>{
		console.log(result);
}).catch(err=> console.log(err));

module.exports.File = File;
module.exports.User = User;
module.exports.Log = Log;
