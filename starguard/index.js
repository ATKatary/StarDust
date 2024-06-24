/*** Imports ***/
const fs = require('node:fs');
const client = require("./bot");
const path = require('node:path');
const token = require("../.creds/starguard.json").token;
const { Client, Collection, Intents } = require('discord.js');

/*** Global Constants ***/
client.commands = new Collection();
const ready = "ready";
let bot = undefined;

/*** Reading Models ***/
const modelsPath = path.join(__dirname, 'models');
const modelFiles = fs.readdirSync(modelsPath).filter(file => file.endsWith('.js'));

for (const file of modelFiles) {
	const filePath = path.join(modelsPath, file);
	const model = require(filePath);
	client.once(ready, () => {model.data.sync()});
}

/*** Reading Commands ***/
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

/*** Reading Events ***/
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token);

