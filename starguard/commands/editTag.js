/*** Imports ***/
const { SlashCommandBuilder } = require('@discordjs/builders');
const Tag = require("../models/tag").data;

/*** Exports ***/
module.exports = {
	data: new SlashCommandBuilder()
		.setName('edit_tag')
		.setDescription('Edits an existing tag')
            .addStringOption(option => 
                option.setName('name')
                    .setDescription('Name of the tag to be edited')
                    .setRequired(true))
            
            .addStringOption(option => 
                option.setName('description')
                    .setDescription('Description of the tag to be edited')
                    .setRequired(true))

            .addStringOption(option => 
                option.setName('icon')
                    .setDescription('Icon for the tag')
                    .setRequired(true)),

	async execute(interaction) { 
		const name = interaction.options.getString('name');
        const icon = interaction.options.getString('icon');
        const description = interaction.options.getString('description');

        const affectedRows = await Tag.update({ description: description, icon: icon }, { where: { name: name } });
                                  
        if (affectedRows > 0) return interaction.reply(`Tag ${name} was edited.`);

        return interaction.reply(`Could not find a tag with name ${name}.`);
	},
};