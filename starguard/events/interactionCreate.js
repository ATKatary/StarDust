/*** Exports ***/
module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {await handleUserMessage(interaction)},
};

/*** Functions ***/
/**
 * Handles the message sent by a user to the bot 
 * 
 * @param {*} interaction: the interaction made by the user
 */
 async function handleUserMessage(interaction) {
    if (!interaction.isCommand()) return;
    const user = interaction.user;
    const command = interaction.client.commands.get(interaction.commandName);

    console.log(`Received a ${interaction.commandName} command from ${user.username} - (${user.id})`);
	if (!command) return;
	try {
		await command.execute(interaction);
	} catch (error) {
		console.log(`Error Occured: ${error}`)
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
}
