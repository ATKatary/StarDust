const { SlashCommandBuilder } = require('@discordjs/builders');
const client = require('../bot');
const Ticket = require("../models/ticket").data;
const issueChannelId = "1002306260059820192";

/*** Exports ***/
module.exports = {
	data: new SlashCommandBuilder()
		.setName('resolve')
		.setDescription('Resolves an open ticket'),
	async execute(interaction) { 
		const allowedRoles = ["Admin", "Owner"]
		const channelName = interaction.channel.name
		const issueChannel = interaction.guild.channels.cache.get("1002307803228143636");
		const username = interaction.user.username;

		if (interaction.member.roles.cache.some(role => allowedRoles.includes(role.name))) {
			if (interaction.channel.parent.id !== issueChannelId) {
				issueChannel.send(`User ${username} attempted to resolve ${channelName} channel`)
				return interaction.reply("You cannot resolve a non ticket support channel, admins have been notified of this.")
			}
			const ticket = await Ticket.findOne({ where: { id: channelName } });

			client.users.fetch(ticket.userId, false).then((user) => {user.send(`Your ticket number ${channelName} has been resolved!`);});
			await Ticket.update({ status: true }, { where: { id: channelName } });
			interaction.channel.delete();
			console.log(`Ticket ${channelName} resolved by ${username}`)
		}
		else {
			issueChannel.send(`User ${username} attempted to resolve ${channelName} channel`)
			console.log(`Non Admin tried resolving ticket ${channelName}`)
		}
	},
};

