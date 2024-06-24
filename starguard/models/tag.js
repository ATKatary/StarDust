/*** Imports ***/
const Sequelize = require('sequelize');

/*** Global Constants ***/
const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

/**
 * Constructs a tag with a name, icon, and usage_count
 */
const Tag = sequelize.define('tags', {
	name: {
		type: Sequelize.STRING,
		unique: true,
	},
	icon: Sequelize.STRING,
    description: Sequelize.TEXT,
	usage_count: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});

/*** Exports ***/
module.exports = {
	name: 'Tag',
	data: Tag,
};
