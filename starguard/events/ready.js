module.exports = {
	name: 'ready',
	once: true,
	execute(client) {bot = client.user; console.log(`${bot.username} - (${bot.id}) is connected!`)},
};