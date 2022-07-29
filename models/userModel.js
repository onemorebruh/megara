const { Sequelize, Model, DataTypes } = require("sequelize");
const config = require('../config');
const sequelize = new Sequelize(`${config.db_url}`);
const db = require("./db");


class User extends Model{}

const model = User.init({
                id: {
                                type: DataTypes.INTEGER,
                                prymaryKey: true,
                                autoIncrement: true,
                },
                login: {
                                type: DataTypes.STRING,
                                allowNull: false,
				},
				password: {
								type: DataTypes.STRING,
								allowNull: false,
				},
},{
                sequelize: db,
                tableName: 'file',
});

File.hasMany(File, {as: 'owner', foreginKey: 'owner'});//TODO finish connection


module.exports = model;



module.exports = User;
