/*** Imports ***/
const { SlashCommandBuilder } = require('@discordjs/builders');
const Tag = require("../models/tag").data;

/*** Exports ***/
module.exports = {
	data: new SlashCommandBuilder()
		.setName('add_tag')
		.setDescription('Creates a new tag')
            .addStringOption(option => 
                option.setName('name')
                    .setDescription('Name of the tag to be created')
                    .setRequired(true))
            
            .addStringOption(option => 
                option.setName('description')
                    .setDescription('Description of the tag to be created')
                    .setRequired(true))

            .addStringOption(option => 
                option.setName('icon')
                    .setDescription('Icon for the tag')
                    .setRequired(true)),
	async execute(interaction) { 
		const name = interaction.options.getString('name');
        const icon = interaction.options.getString('icon');
        const description = interaction.options.getString('description');
        
        try {
            const tag = await Tag.create({
				name: name,
				icon: icon,
                description: description
			});
			return interaction.reply(`Tag ${tag.name} added.`);
		}
		catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') return interaction.reply('That tag already exists.');
			return interaction.reply(`Something went wrong with adding ${name} tag.`);
		}
        
	},
};