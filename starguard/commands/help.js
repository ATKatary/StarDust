const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, PermissionsBitField, ChannelType } = require('discord.js');
const Ticket = require("../models/ticket").data;
const supportTicketChannelId = "1002306260059820192"

/*** Exports ***/
module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Creates a new support ticket'),
	async execute(interaction) { 
		const filter = message => interaction.user.id === message.author.id;
		await interaction.reply('Check your DMs!');
		const greeting = new MessageEmbed()
								.setColor('#0099ff')
								.setDescription(`Hey #${interaction.user.username}, it looks like you're trying to create a ticket! Please start by telling me your Minecraft username.`)

		const dm = await interaction.member.send({embeds: [greeting]});
		const collector = dm.channel.createMessageCollector({filter, max: 4, time: 100000});
		
		let info = {'name': "", 'server': "", 'description': ""}
		
		let i = 0
		let embeds = []
		collector.on('collect', async message => {[i, embeds] = await _openSupportTicket(interaction, dm, message, info, i, embeds)});

		collector.on('end', collected => console.log(`Collected ${collected.size} items`));
	},
};

/*** Helper Functions ***/
async function _openSupportTicket(interaction, dm, message, info, i, embeds) {
	console.log(`Collected ${message.content}`);
	switch (i) {
		case 0: {
			info['name'] = message.content;
			dm.channel.send(`Great! Now tell me the server(s) associated with your support request.`);
			break;
		}
		case 1: {
			info['server'] = message.content;
			dm.channel.send(`Thanks! Now describe your issue in 1 message. Try to be as detailed as possible.`);
			break;
		}
		case 2: {
			info['description'] = message.content
			const ticket = new MessageEmbed()
							.setColor('#0099ff')
							.setTitle('Support Ticket')
							.addFields(
								{name: 'Author', value: interaction.user.username},
								{name: 'Minecraft IGN', value: info['name'], inline: true},
								{name: 'Associated Server(s)', value: info['server'], inline: true},
								{name: 'Issue Description', value: info['description']}
							)
							.setTimestamp()
							.setFooter({ text: 'Stargaurd Support Ticket', iconURL: 'https://i.ibb.co/XzQy2NY/twitter-icon.png' });
			embeds.push(ticket)
			dm.channel.send({embeds: embeds})
			dm.channel.send('Check your ticket above, if everything looks right write **submit** to finish!');
			dm.channel.send('If you need to cancel your ticket just write **cancel**!');
			break;
		}
		default: break;
	}

	if (message.content === "submit") {
		try {
            const ticket = await Ticket.create({
				userId: interaction.user.id,
				user: interaction.user.username,
				ign: info['name'],
				server: info['server'],
                issue: info['description']
			});

			const ticketChannel = await createSupportTicketChannel(interaction, ticket.id, ['Admin']);
			ticketChannel.send(`Hey team, ${interaction.user.username} needs support!`);
			ticketChannel.send({embeds: embeds});
			ticketChannel.send(`When you have helped ${interaction.user.username}, resolve the issue by typing \`/resolve\`!`);

			dm.channel.send(`Your ticket number is ${ticket.id}, it was submitted, a mod will resolve your issue shortly!`);
		}
		catch (error) {
			console.log(`\n----- Error occured while creating ticket -------\n${error}\n`)
			if (error.name === 'SequelizeUniqueConstraintError') return interaction.reply('That tag already exists.');
			dm.channel.send(`Something went wrong with submitting your support request, please try again.`);
		}
	}
	else if (message.content === "cancel") dm.channel.send(`Got it! Canceling support request ....`);

	return [i + 1, embeds];
}

async function createSupportTicketChannel(interaction, channelName, allowedRoles) {
	let privateChannel = undefined
	const guild = interaction.guild;
	await guild.channels.create(channelName, {
		type: "text",
	}).then(channel => {
		console.log("Support ticket channel created!");
		privateChannel = channel;
		const categoryId = supportTicketChannelId;
		channel.setParent(categoryId);
	})

	return privateChannel;
}