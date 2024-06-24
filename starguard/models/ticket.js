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
const Ticket = sequelize.define('supportTicket', {
	userId: {
		type: Sequelize.STRING,
		unique: true,
		defaultValue: "",
	},
	user: {
		type: Sequelize.STRING,
		unique: true,
	},
    ign: Sequelize.STRING,
	server: Sequelize.STRING,
    issue: Sequelize.TEXT,
	status: {
		type: Sequelize.BOOLEAN,
		defaultValue: false,
		allowNull: false,
	},
});

/*** Exports ***/
module.exports = {
	name: 'Ticket',
	data: Ticket,
};
