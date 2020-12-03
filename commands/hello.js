module.exports = {
	name: 'hello',
	description: 'Приветствие',
	execute(message, args) {
		message.channel.send('Привет, ' + message.author);
	},
};
