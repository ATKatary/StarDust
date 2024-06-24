/*** Imports ***/
const { SlashCommandBuilder } = require('@discordjs/builders');
const Tag = require("../models/tag").data;

/*** Exports ***/
module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete_tag')
		.setDescription('Creates a new tag')
            .addStringOption(option => 
                option.setName('name')
                    .setDescription('Name of the tag to be created')
                    .setRequired(true)),
	async execute(interaction) { 
		const name = interaction.options.getString('name');
        const rowCount = await Tag.destroy({ where: { name: name } });

        if (!rowCount) return interaction.reply(`Tag ${name} doesn\'t exist.`);

        return interaction.reply(`Tag ${name} deleted.`);
        
	},
};