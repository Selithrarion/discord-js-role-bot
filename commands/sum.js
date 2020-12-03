module.exports = {
	name: 'sum',
	description: 'Выводит сумму аргументов',
	args: true,
	usage: '<число 1> <число 2> <число 3> ...',
	execute(message, args) {
		const numArgs = args.map((argument) => parseFloat(argument));
		const sum = numArgs.reduce((counter, number) => (counter += number));
		message.reply('Сумма – ' + sum);
	},
};
