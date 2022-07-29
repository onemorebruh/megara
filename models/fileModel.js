const { Model, DataTypes } = require("sequelize");
const config = require('../config');
const sequelize = new Sequelize(`${config.db_url}`);


const model = File.init({
		id: {
				type: DataTypes.INTEGER,
				prymaryKey: true,
				autoIncrement: true,
		},
		owner: {
				type: DataTypes.INTEGER,
				allowNull: false,
		},
},
		sequelize: db,
		tableName: 'file',
});

User.belongsTo()//TODO finish connection


module.exports = model;

