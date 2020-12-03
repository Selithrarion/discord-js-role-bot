module.exports = {
	name: 'ping',
	description: 'Пинг!',
	execute(message, args) {
		const time = Date.now() - message.createdTimestamp;
		message.reply('Понг. Задержка – ' + time);
	},
};
