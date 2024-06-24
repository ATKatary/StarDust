/*** Imports ***/
const { MessageActionRow, Modal, TextInputComponent, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Tag = require("../models/tag").data;

/*** Exports ***/
module.exports = {
	data: new SlashCommandBuilder()
		.setName('tag')
		.setDescription('Fetches an existing tag')
            .addStringOption(option => 
                option.setName('name')
                    .setDescription('Name of the tag to be fetched')
                    .setRequired(true)),
	async execute(interaction) { 
		const name = interaction.options.getString('name');
        const tag = await Tag.findOne({ where: { name: name } });

        if (tag) {
            const title = `${tag.icon}  |  ${tag.name}${" ** ** ".repeat(20)}${tag.usage_count}`
            let description = "";
            i = 0
            for (const word of tag.description.split(" ")) {
                if (i + word.length + 1 < 40) {
                    i += word.length;
                    description = description.concat(`${word} `);
                }
                else {
                    i = word.length;
                    description = description.concat(`\n${word}`);
                }
            }
            
            const tagInfo = new MessageEmbed()
							.setColor('#0099ff')
							.setTitle(title)
							.addFields(
								{name: 'Description', value: description}
							)
							.setFooter({ text: `Stargaurd Tag`, iconURL: 'https://i.ibb.co/XzQy2NY/twitter-icon.png' });
			
            return interaction.reply({embeds: [tagInfo]});
        }

        return interaction.reply(`Could not find tag: ${name}`);
	},
};